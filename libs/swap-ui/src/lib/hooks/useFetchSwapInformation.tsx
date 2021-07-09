import { BigNumberish } from 'ethers';
import type { Option } from 'fp-ts/Option';
import { Token } from '../types';
import { option as O, taskOption as TO, task as T } from 'fp-ts';
import { useEffect, useState } from 'react';
import { pipe } from 'fp-ts/function';
export interface SwapInformation {
  liquidityProviderFee: Option<BigNumberish>;
  minimumReceived: Option<BigNumberish>;
  priceImpact: Option<BigNumberish>;
  slippageTolerance: number;
}
export interface UseSwapInformationProps {
  fetchSwapInformation: (
    tokenA: Token,
    tokenB: Token
  ) => Promise<SwapInformation>;
  tokenA: Option<Token>;
  tokenB: Option<Token>;
}

export const useSwapInformation = ({
  tokenA,
  tokenB,
  fetchSwapInformation,
}: UseSwapInformationProps) => {
  const [information, setInformation] = useState<Option<SwapInformation>>(
    O.none
  );
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
      T.map(setInformation)
    );
  }, [tokenA, tokenB, fetchSwapInformation]);
  return information;
};
