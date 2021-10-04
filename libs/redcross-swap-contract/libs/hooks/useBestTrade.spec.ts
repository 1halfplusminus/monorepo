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

    expect(
      pipe(
        result.current.quotesResults,
        O.map((results) =>
          pipe(
            results,
            A.map((r) => ethers.utils.formatEther(r.amountOut))
          )
        )
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          "3541235311587112787445274118480243527212772820184208948898816065599159568853839322058204055140565.507031114968989696",
          "3620491325159846305602527249817719696891487690723190453730920041271934349201115710634342822438105.251292102833209344",
          "3537577426216426274915947895352454734355802646887462487738870204635741651213869408704696361421568.837115783577337856",
        ],
      }
    `);
    expect(result.current.bestRoute).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Object {
          "amountOut": Object {
            "hex": "0x1785d6aa96c17f37cc1226a6723b0938f3410ccd74a345b1000000000000000000000000000000000000000000000000",
            "type": "BigNumber",
          },
          "bestRoute": undefined,
        },
      }
    `);
  });
});
