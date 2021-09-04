import { Token } from '@uniswap/sdk-core';
import type { Option } from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { option as O } from 'fp-ts';
import { useMemo } from 'react';
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '../constants/routing';
import { getAdditionalBases } from '../utils/getAddionalBases';
export interface UseAllCurrencyCombinations {
  tokenA: Option<Token>;
  tokenB: Option<Token>;
  chainId: Option<number>;
}
export const useAllCurrencyCombinations = ({
  tokenA,
  tokenB,
  chainId,
}: UseAllCurrencyCombinations) => {
  const bases = useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(tokenA, tokenB, chainId),
        O.map(([tokenA, tokenB, chainId]) => {
          const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [];
          const additionalA = getAdditionalBases(chainId)(tokenA);
          const additionalB = getAdditionalBases(chainId)(tokenB);
          return [...common, ...additionalA, ...additionalB];
        })
      ),
    [chainId, tokenA, tokenB]
  );
  return bases;
};
