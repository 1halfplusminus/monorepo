import { ERC20__factory } from '../typechain/factories/ERC20__factory';
export { ERC20__factory } from '../typechain/factories/ERC20__factory';
import { providers } from 'ethers';
import { option as O, task as T, array as A, taskOption as TO } from 'fp-ts';
import { pipe, flow } from 'fp-ts/function';
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
  logoUri: string;
};
export const connectERC20 = (p: providers.Web3Provider) => (address: string) =>
  new ERC20__factory().attach(address).connect(p);

export const getUniswapDefaultTokenList = () =>
  pipe(
    () => fetch('https://gateway.ipfs.io/ipns/tokens.uniswap.org'),
    T.map((r) => r.json),
    T.flatten,
    T.map((r) => r as TokenListItem[]),
    TO.fromTask,
    TO.map((r) =>
      pipe(
        r,
        A.map((r) =>
          O.some({
            symbol: r.logoUri,
            address: r.address,
            name: r.name,
          } as Token)
        )
      )
    )
  )();
