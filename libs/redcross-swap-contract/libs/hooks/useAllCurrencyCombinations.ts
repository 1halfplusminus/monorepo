import { Token } from '@uniswap/sdk-core';
import type { Option } from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { option as O, array as A, function as F, record as R } from 'fp-ts';
import { useMemo } from 'react';
import {
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
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
  const basePairs: Option<[Token, Token][]> = useMemo(
    () =>
      pipe(
        bases,
        O.map((bases) =>
          pipe(
            bases,
            A.map((b) =>
              pipe(
                bases,
                A.map((b1): [Token, Token] => [b, b1])
              )
            ),

            A.flatten
          )
        )
      ),
    [bases]
  );
  return useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(tokenA, tokenB, bases, basePairs, chainId),
        O.map(([tokenA, tokenB, bases, basePairs, chainId]) =>
          pipe(
            [],
            A.append,
            F.constant(
              pipe(
                bases,
                A.map((base): [Token, Token] => [tokenA, base])
              )
            ),
            A.append,
            F.constant(
              pipe(
                bases,
                A.map((base): [Token, Token] => [tokenB, base])
              )
            ),
            A.append,
            F.constant(basePairs),

            A.filter((tokens) => Boolean(tokens[0] && tokens[1])),
            A.filter(([t0, t1]) => t0.address !== t1.address),
            A.filter(([tokenA, tokenB]) =>
              pipe(
                CUSTOM_BASES,
                R.lookup(chainId.toString()),
                O.chain((customBases) =>
                  pipe(
                    sequenceT(O.Apply)(
                      ...[
                        pipe(customBases, R.lookup(tokenA.address)),
                        pipe(customBases, R.lookup(tokenB.address)),
                      ]
                    ),
                    O.chain(([customBasesA, customBasesB]) =>
                      pipe(
                        pipe(
                          customBasesA,
                          A.findLast((base) => tokenB.equals(base)),
                          O.fold(
                            () =>
                              pipe(
                                customBasesB,
                                A.findLast((base) => tokenA.equals(base))
                              ),
                            (r) => O.some(r)
                          )
                        )
                      )
                    )
                  )
                ),
                O.fold(
                  () => true,
                  () => false
                )
              )
            )
          )
        )
      ),
    [basePairs, tokenA, tokenB, chainId]
  );
};
