import { Token } from '../types';
import { BigNumberish } from 'ethers';
import type { Option } from 'fp-ts/Option';
import { useState } from 'react';
import { flow, pipe } from 'fp-ts/lib/function';
import * as options from 'fp-ts/Option';
import * as taskOptions from 'fp-ts/TaskOption';
import { useEffect } from 'react';

export interface UseFetchRateProps {
  fetchRate: (tokenA: Token, tokenB: Token) => Promise<Option<BigNumberish>>;
  tokenA: Option<Token>;
  tokenB: Option<Token>;
}

export type UseFetchRate = (
  props: UseFetchRateProps
) => { rate: Option<BigNumberish> };

const mapPairToken = flow((tokenA: Option<Token>, tokenB: Option<Token>) =>
  pipe(
    tokenA,
    options.chain((tokenA) =>
      pipe(
        tokenB,
        options.map((tokenB) => [tokenA, tokenB] as const)
      )
    )
  )
);
export const useFetchRate: UseFetchRate = ({ tokenA, tokenB, fetchRate }) => {
  const [rate, setRate] = useState<Option<BigNumberish>>(options.none);
  useEffect(() => {
    pipe(
      mapPairToken(tokenA, tokenB),
      options.fold(
        () => taskOptions.zero<BigNumberish>(),
        ([tokenA, tokenB]) => () => fetchRate(tokenA, tokenB)
      ),
      taskOptions.map((rate) => setRate(options.some(rate)))
    )();
  }, [tokenA, tokenB, fetchRate]);
  return { rate };
};
