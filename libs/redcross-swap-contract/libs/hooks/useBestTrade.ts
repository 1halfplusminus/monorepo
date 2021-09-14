import { SupportedChainId } from '../constants/chains';
import type { Option } from 'fp-ts/Option';
import {
  option as O,
  array as A,
  function as F,
  taskOption as TO,
} from 'fp-ts';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { IQuoter } from '../../typechain/IQuoter';
import { useAllRoute } from './useAllRoute';
import { encodeRouteToPath, Pool, Route } from '@uniswap/v3-sdk';
import { BigNumberish, BigNumber } from 'ethers';
import { useMemo } from 'react';
import { pipe } from 'fp-ts/function';
import { sequenceT } from 'fp-ts/lib/Apply';

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
              `Ox${amountIn.quotient.toString(16)}`,
            ])
          )
        )
      ),
    [currencyAmount, routes]
  );
  const quotesResults = useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(quoter, quoteExactInInputs, currencyAmount),
        O.map(([quoter, quoteExactInInputs, currencyAmount]) =>
          pipe(
            quoteExactInInputs,
            A.map(([path, amountIn]) =>
              TO.tryCatch(() => quoter.quoteExactInput(path, amountIn))
            ),
            TO.sequenceArray,
            TO.map((r) =>
              pipe(
                [...r],
                A.map((r) =>
                  quoter.interface.decodeFunctionResult(
                    'quoteExactInput',
                    r.data
                  )
                )
              )
            )
          )
        ),
        TO.fromOption,
        TO.flatten
      ),
    [quoter, quoteExactInInputs, currencyAmount]
  );

  return useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(amountIn),
        O.map(() =>
          pipe(
            quotesResults,
            TO.map((results) =>
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
                    } else if (acc.amountOut.lt(r.amountIn)) {
                      return { bestRoute: routes[i], amountOut: r.amountOut };
                    }
                    return acc;
                  }
                )
              )
            )
          )
        )
      ),
    [amountIn, tokenOut, quotesResults, routes]
  );
};
