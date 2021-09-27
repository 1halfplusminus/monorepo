import { SupportedChainId } from '../constants/chains';
import type { Option } from 'fp-ts/Option';
import { option as O, array as A, taskOption as TO, task as T } from 'fp-ts';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { IQuoter } from '../../typechain/IQuoter';
import { useAllRoute } from './useAllRoute';
import { encodeRouteToPath, Pool, Route, Trade } from '@uniswap/v3-sdk';
import { BigNumberish, BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { pipe } from 'fp-ts/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { Result } from '@ethersproject/abi';
import { defaultPools } from '../uniswap-subgraph';

const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
  [SupportedChainId.OPTIMISM]: 6_000_000,
  [SupportedChainId.OPTIMISTIC_KOVAN]: 6_000_000,
};

const DEFAULT_GAS_QUOTE = 2_000_000;
interface UseBestV3TradeExactIn {
  tokenIn: Option<Token>;
  tokenOut: Option<Token>;
  chainId: Option<number>;
  quoter: Option<IQuoter>;
  pools: Option<Pool[]>;
  amountIn: Option<BigNumberish>;
}

export const useBestV3TradeExactIn = ({
  tokenIn,
  tokenOut,
  chainId,
  quoter,
  pools,
  amountIn,
}: UseBestV3TradeExactIn) => {
  const routes = useAllRoute({ chainId, tokenIn, tokenOut, pools });
  const currencyAmount = useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(amountIn, tokenIn),
        O.map(([amountIn, tokenIn]) =>
          CurrencyAmount.fromRawAmount(tokenIn, amountIn.toString())
        )
      ),
    [amountIn, tokenIn]
  );
  const quoteExactInInputs = useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(routes, currencyAmount),
        O.map(([routes, amountIn]) =>
          pipe(
            routes,
            A.map((route) => [
              encodeRouteToPath(route, false),
              `0x${amountIn.quotient.toString(16)}`,
            ])
          )
        )
      ),
    [currencyAmount, routes]
  );
  const [quotesResults, setQuotesResults] = useState<
    O.Option<Array<{ amountOut: BigNumber }>>
  >(O.none);

  const [bestRoute, setBestRoute] = useState<
    O.Option<{
      bestRoute: Route<Token, Token>;
      amountOut: BigNumberish;
    }>
  >(O.none);

  /* useEffect(() => {
    pipe(
      sequenceT(O.Apply)(pools, tokenIn, currencyAmount),
      O.map(([pools, tokenIn, currencyAmount]) =>
        pipe(
          () => Trade.bestTradeExactOut(pools, tokenIn, currencyAmount),
          T.map((r) => O.some(r))
        )
      ),
      TO.fromOption,
      TO.flatten,
      TO.map((t) =>
        setBestRoute(
          O.some({
            bestRoute: t[0].swaps[0].route,
            amountOut: t[0].swaps[0].outputAmount.toFixed(),
          })
        )
      )
    )();
  }, [pools, tokenIn, currencyAmount]); */
  useEffect(() => {
    pipe(
      sequenceT(O.Apply)(routes, currencyAmount),
      O.map(([routes, currencyAmount]) =>
        pipe(
          routes,
          A.map((r) =>
            pipe(
              r.pools,
              (r) => {
                console.log('routes', r);
                return r;
              },
              A.reduce(
                () => Promise.resolve(currencyAmount),
                (acc, p) => {
                  console.log('pool' + p.token0);
                  return pipe(
                    acc,
                    T.chain(() =>
                      pipe(
                        async () => [currencyAmount, p] as const,
                        T.map((r) => r[0])
                      )
                    )
                  );
                }
              ),
              T.map((r) => O.some(r))
            )
          ),
          TO.sequenceArray
        )
      ),
      TO.fromOption,
      TO.flatten
      /*       TO.map((r) => setQuotesResults(O.some([...r]))) */
    )();
  }, [routes, tokenIn, currencyAmount]);
  /*  useEffect(() => {
    pipe(
      sequenceT(O.Apply)(quoter, quoteExactInInputs, currencyAmount, chainId),
      O.map(([quoter, quoteExactInInputs, currencyAmount, chainId]) =>
        pipe(
          quoteExactInInputs,
          A.map(([path, amountIn]) =>
            TO.tryCatch(() =>
              quoter
                .quoteExactInput(path, amountIn, {
                  gasPrice: QUOTE_GAS_OVERRIDES[chainId],
                })
                .catch((e) => {
                  console.log(e);
                })
            )
          ),
          TO.sequenceArray,
          TO.map((r: any) =>
            pipe(
              [...r],
              A.map((r) =>
                quoter.interface.decodeFunctionResult('quoteExactInput', r.data)
              )
            )
          )
        )
      ),
      TO.fromOption,
      TO.flatten,
      T.map((r) => setQuotesResults(r))
    )();
  }, [quoter, quoteExactInInputs, currencyAmount]); */
  /* useEffect(() => {
    pipe(
      sequenceT(O.Apply)(amountIn),
      O.map(() =>
        pipe(
          quotesResults,
          O.map((results) =>
            pipe(
              [...results],
              A.reduceWithIndex(
                { bestRoute: null, amountOut: null } as {
                  bestRoute: Route<Token, Token>;
                  amountOut: BigNumber;
                },
                (i, acc) => {
                  const r = results[i];
                  if (!r) return acc;
                  if (acc.amountOut == null) {
                    return { bestRoute: routes[i], amountOut: r.amountOut };
                  } else if (acc.amountOut.lt(r.amountOut)) {
                    return { bestRoute: routes[i], amountOut: r.amountOut };
                  }

                  return acc;
                }
              )
            )
          )
        )
      ),
      O.map((r) => setBestRoute(r))
    );
  }, [amountIn, tokenOut, quotesResults, routes]); */
  console.log(defaultPools, currencyAmount);
  return { bestRoute, quotesResults };
};
