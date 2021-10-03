import { useBestV3TradeExactIn } from './useBestTrade';
import { pipe } from 'fp-ts/function';
import { defaultPools, groupBySymbol } from '../uniswap-subgraph';
import { option as O, record as R } from 'fp-ts';
import { createTokensMapFromPools } from '../utils/createTokensMapFromPools';
import { createUniswapToken, useQuoter } from '../uniswap';
import { createPoolsFromSubgraph } from '../utils/createPoolsFromSubgraph';
import { signer } from '../__mocks__/providers';
import { renderHook } from '@testing-library/react-hooks';

import fetch from 'node-fetch';
import result from 'antd/lib/result';
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

    /*     expect(O.isSome(result.current[0].quotesResults)).toBe(true); */
    await waitForValueToChange(() => result.current.bestRoute, {
      timeout: 10000,
    });
    console.log(result.current.routes);
    expect(result.current.quotesResults).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [],
      }
    `);
    expect(result.current.bestRoute).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Object {
          "amountOut": null,
          "bestRoute": null,
        },
      }
    `);
  });
});
