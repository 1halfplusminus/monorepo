import { Pool, Route } from '@uniswap/v3-sdk';
import {
  eq as EQ,
  array as A,
  option as O,
  monoid as M,
  function as F,
} from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { Token } from '@uniswap/sdk-core';
import type { Option } from 'fp-ts/Option';
import { PoolsList } from '../uniswap-subgraph';
import { useMemo } from 'react';
import { sequenceT } from 'fp-ts/lib/Apply';

export const poolEquals = (poolA: Pool) => (poolB: Pool) =>
  pipe(
    poolA === poolB ||
      (poolA.token0.equals(poolB.token0) &&
        poolA.token1.equals(poolB.token1) &&
        poolA.fee === poolB.fee)
  );

export const eqPool = EQ.fromEquals((poolA: Pool, poolB: Pool) =>
  poolEquals(poolA)(poolB)
);

export const computeAllRoutes = (
  tokenIn: Token,
  tokenOut: Token,
  pools: Pool[],
  chainId: number,
  currentPath: Pool[] = [],
  allPaths: Route<Token, Token>[] = [],
  startCurrencyIn: Token = tokenIn,
  maxHops = 2
): Route<Token, Token>[] =>
  pipe(
    pools,
    A.map((p) =>
      pipe(
        [
          pipe(
            p,
            O.fromPredicate(() => p.involvesToken(tokenIn))
          ),
          pipe(
            currentPath,
            A.findFirst((pathPool) => poolEquals(pathPool)(p))
          ),
        ],
        A.reduceRight(O.none, O.getLastMonoid<Pool>().concat)
      )
    ),
    A.compact,
    A.map((p) => [p.token0.equals(tokenIn) ? p.token1 : p.token0, p] as const),
    A.map(([outputToken, p]) =>
      pipe(
        pipe(
          allPaths,
          O.fromPredicate(() => outputToken.equals(tokenOut)),
          O.map((allPaths) =>
            pipe(
              allPaths,
              A.append(
                new Route([...currentPath, p], startCurrencyIn, tokenOut)
              )
            )
          ),
          O.fold(
            () =>
              pipe(
                maxHops,
                O.fromPredicate((maxHops) => maxHops > 1),
                O.map((maxHops) =>
                  computeAllRoutes(
                    outputToken,
                    tokenOut,
                    pools,
                    chainId,
                    [...currentPath, p],
                    allPaths,
                    startCurrencyIn,
                    maxHops - 1
                  )
                ),
                O.fold(
                  () => allPaths,
                  (r) => r
                )
              ),
            (allPaths) => allPaths
          )
        )
      )
    ),
    A.flatten
  );

export interface UseAllRoute {
  tokenOut: Option<Token>;
  tokenIn: Option<Token>;
  chainId: Option<number>;
  pools: Option<Pool[]>;
  singleHopOnly?: Option<boolean>;
}
export const useAllRoute = ({
  chainId,
  tokenIn,
  tokenOut,
  pools,
  singleHopOnly = O.none,
}: UseAllRoute) => {
  const allRoutes = useMemo(
    () =>
      pipe(
        singleHopOnly,
        O.chain((r) => (r ? O.some(1) : O.none)),
        O.getOrElse(() => 2),
        (singleHopOnly) =>
          pipe(
            sequenceT(O.Apply)(chainId, tokenIn, tokenOut, pools),
            O.map(([chainId, currencyIn, currencyOut, pools]) =>
              computeAllRoutes(
                currencyIn,
                currencyOut,
                pools,
                chainId,
                [],
                [],
                currencyIn,
                singleHopOnly
              )
            )
          )
      ),
    [chainId, tokenIn, tokenOut, pools, singleHopOnly]
  );

  return allRoutes;
};
