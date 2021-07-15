import { BigNumberish } from 'ethers';
import type { Option } from 'fp-ts/Option';
import { Token } from '../types';
import { option as O, taskOption as TO, task as T } from 'fp-ts';
import { useEffect, useState } from 'react';
import { pipe } from 'fp-ts/function';
import { TokenList } from './tokenList';
export interface SwapInformation {
  liquidityProviderFee: Option<BigNumberish>;
  minimumReceived: Option<BigNumberish>;
  priceImpact: Option<BigNumberish>;
  slippageTolerance: number;
  routes: TokenList;
}
export interface UseSwapInformationProps {
  fetchSwapInformation: (
    tokenA: Token,
    tokenB: Token
  ) => Promise<Omit<SwapInformation, 'slippageTolerance'>>;
  tokenA: Option<Token>;
  tokenB: Option<Token>;
}
export const emptySwapInformation = {
  liquidityProviderFee: O.none,
  minimumReceived: O.none,
  priceImpact: O.none,
  routes: O.none,
};
export const neverSwapInformation = async () => emptySwapInformation;

export const useSwapInformation = ({
  tokenA,
  tokenB,
  fetchSwapInformation = neverSwapInformation,
}: UseSwapInformationProps) => {
  const [information, setInformation] = useState<
    Omit<SwapInformation, 'slippageTolerance'>
  >(emptySwapInformation);
  useEffect(() => {
    pipe(
      tokenA,
      O.chain((tokenA) =>
        pipe(
          tokenB,
          O.map((tokenB) =>
            pipe(() => fetchSwapInformation(tokenA, tokenB), TO.fromTask)
          )
        )
      ),
      TO.fromOption,
      TO.flatten,
      TO.fold(
        () => neverSwapInformation,
        (r) => async () => r
      ),
      T.map(setInformation)
    )();
  }, [tokenA, tokenB, fetchSwapInformation]);
  return information;
};
