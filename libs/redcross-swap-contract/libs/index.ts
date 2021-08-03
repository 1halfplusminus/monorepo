import { ERC20__factory } from '../typechain/factories/ERC20__factory';
export { ERC20__factory } from '../typechain/factories/ERC20__factory';
import { providers } from 'ethers';
import {
  option as O,
  task as T,
  array as A,
  taskOption as TO,
  nonEmptyArray as NEA,
  record as R,
  ord as ORD,
  number as N,
} from 'fp-ts';
import { pipe, flow } from 'fp-ts/function';
import { concatAll, Monoid } from 'fp-ts/Monoid';

export interface Token {
  symbol: string;
  address: string;
  name: string;
  fullName?: string;
  isNative?: boolean;
  decimals: number;
  chainId: number;
}
type TokenListItem = {
  address: string;
  name: string;
  decimals: number;
  logoURI: string;
  symbol: string;
  chainId: number;
};

export { ERC20 } from '../typechain/';

export const ordChainId = ORD.fromCompare<TokenListItem>((a, b) =>
  N.Ord.compare(Number(a.chainId), Number(b.chainId))
);

export const ordChainIdInverse = ORD.fromCompare<TokenListItem>((a, b) =>
  N.Ord.compare(Number(a.chainId), Number(b.chainId))
);

const monoidString: Monoid<string> = {
  concat: (x, y) => (x ? x : y),
  empty: '',
};
const monoidProduct: Monoid<number> = {
  concat: (x, y) => (x ? x : y),
  empty: 0,
};

const monoidTokenListItem2: (chainId: number) => Monoid<TokenListItem> = (
  chainId
) => ({
  concat: (x, y) => ({
    name: x.chainId === chainId ? x.name : y.name,
    symbol: x.chainId === chainId ? x.symbol : y.symbol,
    logoURI: x.chainId == 1 ? x.logoURI : y.logoURI,
    address: x.chainId === chainId ? x.address : y.address,
    decimals: x.chainId === chainId ? x.decimals : y.decimals,
    chainId: x.chainId === chainId ? x.chainId : y.chainId,
  }),
  empty: {
    name: monoidString.empty,
    symbol: monoidString.empty,
    logoURI: monoidString.empty,
    address: monoidString.empty,
    decimals: monoidProduct.empty,
    chainId: monoidProduct.empty,
  },
});
export const selectTokens = flow((a: {} | { tokens: TokenListItem[] }) =>
  'tokens' in a ? a.tokens : []
);

export const filterByChainId = (chainId: number) =>
  flow((tokens: TokenListItem[]) =>
    pipe(
      tokens,
      A.filter((i) => i.chainId == chainId)
    )
  );
export const groupByChaindId = (chainId: number) =>
  flow((tokens: TokenListItem[]) =>
    pipe(
      tokens,
      A.sort(ordChainId),
      mergeInformation(chainId),
      NEA.groupBy((i) => i.chainId.toString())
    )
  );
export const groupBySymbol = flow((tokens: TokenListItem[]) =>
  pipe(
    tokens,
    NEA.groupBy((i) => i.symbol)
  )
);
export const mergeInformation = (chainId: number) =>
  flow((tokens: TokenListItem[]) =>
    pipe(
      tokens,
      A.sort(ORD.reverse(ordChainId)),
      groupBySymbol,
      R.map(concatInformation(chainId)),
      R.filter((v) => v.chainId === chainId),
      R.collect((k, v) => v)
    )
  );

export const concatInformation = (chainId: number) =>
  flow((tokens: TokenListItem[]) =>
    pipe(tokens, concatAll(monoidTokenListItem2(chainId)))
  );

export const connectERC20 = (p: providers.Web3Provider) => (address: string) =>
  new ERC20__factory().attach(address).connect(p);

export const mapTokenListItemToToken = (r: TokenListItem) =>
  ({
    symbol: r.logoURI,
    address: r.address,
    name: r.symbol,
    fullName: r.name,
    isNative: r.symbol === 'ETH',
    chainId: r.chainId,
    decimals: r.decimals,
  } as Token);

export const getUniswapDefaultTokenList = (chainId: number) =>
  pipe(
    () =>
      fetch('https://gateway.ipfs.io/ipns/tokens.uniswap.org').then((r) =>
        r.json()
      ),
    T.map(selectTokens),
    TO.fromTask,
    TO.map((r) =>
      pipe(
        r,
        mergeInformation(chainId),
        A.map((t) => pipe(t, mapTokenListItemToToken, O.some))
      )
    )
  )();

export * from './uniswap';
