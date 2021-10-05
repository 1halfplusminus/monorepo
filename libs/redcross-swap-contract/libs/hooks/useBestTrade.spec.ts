import { useBestV3TradeExactIn } from './useBestTrade';
import { pipe } from 'fp-ts/function';
import { defaultPools, groupBySymbol } from '../uniswap-subgraph';
import { option as O, record as R } from 'fp-ts';
import { createTokensMapFromPools } from '../utils/createTokensMapFromPools';
import { createUniswapToken, useQuoter } from '../uniswap';
import { createPoolsFromSubgraph } from '../utils/createPoolsFromSubgraph';
import { signer } from '../__mocks__/providers';
import { renderHook } from '@testing-library/react-hooks';
import { array as A } from 'fp-ts';
import fetch from 'node-fetch';
import result from 'antd/lib/result';
import { ethers } from 'ethers';
import { CurrencyAmount } from '@uniswap/sdk-core';
import { sequenceT } from 'fp-ts/lib/Apply';
(global as any).fetch = fetch as any;
jest.setTimeout(100000);
describe('Use Best Trade', () => {
  const chainId = 1;
  const pools = groupBySymbol(defaultPools);
  const poolsOption = O.some(pools);
  const uniswapPools = pipe(pools, createPoolsFromSubgraph(chainId), O.some);
  const tokens = createTokensMapFromPools(chainId)(pools);
  const tokenA = pipe(tokens, R.lookup('AAVE'));
  const tokenB = pipe(tokens, R.lookup('BAL'));

  it('should use best trade', async () => {
    const tokenIn = tokenA;
    const tokenOut = tokenB;

    const amountIn = O.some(1);
    const someChainId = O.some(chainId);
    const { result, waitForValueToChange } = renderHook(() => {
      const quoter = useQuoter({
        provider: O.some(signer),
        chainId: O.some(chainId),
      });
      return useBestV3TradeExactIn({
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountIn: amountIn,
        chainId: someChainId,
        pools: uniswapPools,
        quoter,
      });
    });

    await waitForValueToChange(() => result.current.bestRoute, {
      timeout: 10000,
    });

    expect(
      pipe(
        sequenceT(O.Apply)(result.current.quotesResults),
        O.map(([results]) =>
          pipe(
            results,
            A.map((r) => result.current.formatOutToken(r.amountOut))
          )
        )
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          Object {
            "_tag": "Some",
            "value": "13.400098189900522044",
          },
          Object {
            "_tag": "Some",
            "value": "13.700004372508515041",
          },
          Object {
            "_tag": "Some",
            "value": "13.386256685786345597",
          },
        ],
      }
    `);
    expect(
      pipe(
        result.current.bestRoute,
        O.map((r) => r.bestRoute.tokenPath.map((t) => t.symbol))
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          "AAVE",
          "WETH",
          "BAL",
        ],
      }
    `);
  });
});
