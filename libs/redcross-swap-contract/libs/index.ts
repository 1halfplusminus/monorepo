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
import { fromEquals } from 'fp-ts/Eq';
import { concatAll, Monoid, struct } from 'fp-ts/Monoid';
import { getLastMonoid, getMonoid } from 'fp-ts/Option';
import { first } from 'fp-ts/Semigroup';
import { merge } from 'lodash/fp';

export interface Token {
  symbol: string;
  address: string;
  name: string;
  fullName?: string;
  isNative?: boolean;
}
type TokenListItem = {
  address: string;
  name: string;
  decimals: number;
  logoURI: string;
  symbol: string;
  chainId: number;
};

const ordChainId = ORD.fromCompare<TokenListItem>((a, b) =>
  N.Ord.compare(Number(a.chainId), Number(b.chainId))
);
const eqTokenListItem = fromEquals<TokenListItem>(
  (t1, t2) => t1.symbol === t2.symbol
);

const monoidString: Monoid<string> = {
  concat: (x, y) => (x ? x : y),
  empty: '',
};
const monoidProduct: Monoid<number> = {
  concat: (x, y) => (x ? x : y),
  empty: 0,
};
const monoidTokenListItem: Monoid<TokenListItem> = struct({
  name: monoidString,
  symbol: monoidString,
  logoURI: monoidString,
  address: monoidString,
  decimals: monoidProduct,
  chainId: monoidProduct,
});

const monoidTokenListItem2: Monoid<TokenListItem> = {
  concat: (x, y) => ({
    name: monoidString.concat(x.name, y.name),
    symbol: monoidString.concat(x.symbol, y.symbol),
    logoURI: x.chainId == 1 ? x.logoURI : y.logoURI,
    address: monoidString.concat(x.address, y.address),
    decimals: monoidProduct.concat(x.decimals, x.decimals),
    chainId: monoidProduct.concat(x.chainId, y.chainId),
  }),
  empty: {
    name: monoidString.empty,
    symbol: monoidString.empty,
    logoURI: monoidString.empty,
    address: monoidString.empty,
    decimals: monoidProduct.empty,
    chainId: monoidProduct.empty,
  },
};
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
export const groupByChaindId = flow((tokens: TokenListItem[]) =>
  pipe(
    tokens,
    A.sort(ordChainId),
    mergeInformation,
    NEA.groupBy((i) => i.chainId.toString())
  )
);
export const groupBySymbol = flow((tokens: TokenListItem[]) =>
  pipe(
    tokens,
    NEA.groupBy((i) => i.symbol)
  )
);
export const mergeInformation = flow((tokens: TokenListItem[]) =>
  pipe(
    tokens,
    groupBySymbol,
    R.map(concatInformation),
    R.collect((k, v) => v)
  )
);

export const concatInformation = flow((tokens: TokenListItem[]) =>
  pipe(tokens, concatAll(monoidTokenListItem2))
);

export const connectERC20 = (p: providers.Web3Provider) => (address: string) =>
  new ERC20__factory().attach(address).connect(p);
export const mapTokenListItemToToken = (r: TokenListItem) =>
  O.some({
    symbol: r.logoURI,
    address: r.address,
    name: r.symbol,
    fullName: r.name,
    isNative: r.symbol === 'ETH',
  } as Token);

export const getUniswapDefaultTokenList = (chainId: string) =>
  pipe(
    () =>
      fetch('https://gateway.ipfs.io/ipns/tokens.uniswap.org').then((r) =>
        r.json()
      ),
    T.map(selectTokens),
    TO.fromTask,
    TO.map((r) => pipe(r, A.map(mapTokenListItemToToken)))
  )();
