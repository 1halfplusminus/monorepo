import { SupportedChainId } from '../constants/chains';
import type { Option } from 'fp-ts/Option';
import { option as O, array as A, taskOption as TO, task as T } from 'fp-ts';
import { Token, CurrencyAmount } from '@uniswap/sdk-core';
import { IQuoter } from '../../typechain/IQuoter';
import { useAllRoute } from './useAllRoute';
import { encodeRouteToPath, Pool, Route, Trade } from '@uniswap/v3-sdk';
import { BigNumberish, BigNumber, ethers } from 'ethers';
import { useEffect, useMemo, useState, useCallback } from 'react';
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
  pools,
  amountIn,
}: UseBestV3TradeExactIn) => {
  const routes = useAllRoute({
    chainId,
    tokenIn,
    tokenOut,
    pools,
  });
  const currencyAmount = useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(amountIn, tokenIn),
        O.map(([amountIn, tokenIn]) =>
          CurrencyAmount.fromRawAmount(
            tokenIn,
            ethers.utils
              .parseUnits(amountIn.toString(), tokenIn.decimals)
              .toString()
          )
        )
      ),
    [amountIn, tokenIn]
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
  useEffect(() => {
    pipe(
      sequenceT(O.Apply)(routes, currencyAmount, tokenOut),
      O.map(([routes, currencyAmount, tokenOut]) =>
        pipe(routes, (routes) => async () => {
          const accs: Array<CurrencyAmount<Token>> = [];
          let acc: CurrencyAmount<Token>;
          console.log('exchange: ' + currencyAmount.toSignificant());
          for (let route of routes) {
            console.log('route chain id ' + route.chainId);
            acc = route.midPrice.quote(currencyAmount);
            console.log(
              'route ' + route.input.symbol + ' => ' + route.output.symbol
            );
            console.log('result: ' + acc.toSignificant());
            accs.push(acc);
          }
          const formattedAccs = pipe(
            accs,
            A.map((r) => {
              return {
                amountOut: ethers.utils.parseUnits(
                  r.toFixed(),
                  tokenOut.decimals
                ),
              };
            })
          );
          setQuotesResults(O.some([...formattedAccs]));

          return O.some(true);
        })
      ),
      TO.fromOption,
      TO.flatten
    )();
  }, [routes]);
  useEffect(() => {
    pipe(
      sequenceT(O.Apply)(amountIn, routes),
      O.map(([aIn, routes]) =>
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
  }, [amountIn, quotesResults, routes]);
  const formatOutToken = useCallback(
    (value: BigNumberish) =>
      pipe(
        tokenOut,
        O.map((tokenOut) => ethers.utils.formatUnits(value, tokenOut.decimals))
      ),
    [tokenOut]
  );
  const bestPriceFormated = useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(bestRoute),
        O.chain(([br]) => formatOutToken(br.amountOut))
      ),
    [bestRoute]
  );
  return {
    bestRoute,
    quotesResults,
    routes,
    bestPriceFormated,
    formatOutToken,
  };
};
