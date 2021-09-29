import { SupportedChainId } from '../constants/chains';
import type { Option } from 'fp-ts/Option';
import { option as O, array as A, taskOption as TO, task as T } from 'fp-ts';
import { Token, CurrencyAmount } from '@uniswap/sdk-core';
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
          CurrencyAmount.fromRawAmount(tokenIn, amountIn.toString())
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
      sequenceT(O.Apply)(routes, currencyAmount),
      O.map(([routes, currencyAmount]) =>
        pipe(routes, (routes) => async () => {
          const accs: Array<CurrencyAmount<Token>> = [];
          let acc: CurrencyAmount<Token>;
          for (let route of routes) {
            console.log('route chain id ' + route.chainId);
            acc = route.midPrice.quote(currencyAmount);
            console.log(
              'quote: ' + acc.currency.symbol + ' ' + acc.denominator
            );
            console.log(
              'route ' + route.input.symbol + ' => ' + route.output.symbol
            );
            console.log('result: ' + acc.asFraction.numerator);
            accs.push(acc);
          }
          const formattedAccs = pipe(
            accs,
            A.map((r) => {
              return {
                amountOut: BigNumber.from(r.numerator.toString(10)),
              };
            })
          );
          setQuotesResults(O.some([...formattedAccs]));
          /*  const accs: Array<CurrencyAmount<Token>> = [];
          console.log('here');
          for (let route of routes) {
            let acc: CurrencyAmount<Token> = currencyAmount;
            console.log('here');
            for (let pool of route.pools) {
              console.log('here');
              const r = await pool.getOutputAmount(acc)[0];
              console.log(r);
              if (r) {
                acc = r;
              }
            }
            accs.push(acc);
          }
          const formattedAccs = pipe(
            accs,
            A.map((r) => {
              console.log(r.numerator);
              return {
                amountOut: BigNumber.from(r.numerator.toString(10)),
              };
            })
          );

          setQuotesResults(O.some([...formattedAccs])); */
          return O.some(true);
        })
      ),
      TO.fromOption,
      TO.flatten
    )();
  }, [routes]);
  useEffect(() => {
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
  }, [amountIn, quotesResults, routes]);

  return { bestRoute, quotesResults, routes };
};
