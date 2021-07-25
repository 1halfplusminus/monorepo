import { ERC20__factory } from '../typechain/factories/ERC20__factory';
export { ERC20__factory } from '../typechain/factories/ERC20__factory';
import { providers } from 'ethers';
import { option as O, task as T, array as A, taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { fromEquals } from 'fp-ts/Eq';
import { concatAll, Monoid, struct } from 'fp-ts/Monoid';
import { getLastMonoid, getMonoid } from 'fp-ts/Option';
import { first } from 'fp-ts/Semigroup';
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
};

const eqTokenListItem = fromEquals<TokenListItem>(
  (t1, t2) => t1.symbol === t2.symbol
);
const monoidString: Monoid<string> = {
  concat: (x, y) => x + y,
  empty: '',
};
const monoidProduct: Monoid<number> = {
  concat: (x, y) => x * y,
  empty: 1,
};
const monoidTokenListItem: Monoid<TokenListItem> = struct({
  name: monoidString,
  symbol: monoidString,
  logoURI: monoidString,
  address: monoidString,
  decimals: monoidProduct,
});
export const connectERC20 = (p: providers.Web3Provider) => (address: string) =>
  new ERC20__factory().attach(address).connect(p);

export const getUniswapDefaultTokenList = () =>
  pipe(
    () =>
      fetch('https://gateway.ipfs.io/ipns/tokens.uniswap.org').then((r) =>
        r.json()
      ),
    T.map((r) => r.tokens as TokenListItem[]),
    TO.fromTask,
    TO.map((r) =>
      pipe(
        r,
        concatAll(monoidTokenListItem),
        A.map((r) =>
          O.some({
            symbol: r.logoURI,
            address: r.address,
            name: r.symbol,
            fullName: r.name,
            isNative: r.symbol === 'ETH',
          } as Token)
        )
      )
    )
  )();
