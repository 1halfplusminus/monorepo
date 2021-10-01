import { getMockTokens } from '../utils/getMockTokens';
import {
  option as O,
  record as R,
  io as IO,
  function as f,
  array as A,
} from 'fp-ts';
import {
  defaultPools,
  groupBySymbol,
  selectPoolByToken,
} from '../uniswap-subgraph';
import { pipe } from 'fp-ts/function';
import {
  createPoolFromSubgrap,
  createUniswapToken,
  createTokenFromSubgraph,
} from '../uniswap';
import { sequenceT } from 'fp-ts/lib/Apply';
import { computeAllRoutes, eqPool, useAllRoute } from './useAllRoute';
import { renderHook } from '@testing-library/react-hooks';
import { selectFirstPool } from '../utils/selectFirstPool';
import { createPoolsFromSubgraph } from '../utils/createPoolsFromSubgraph';
import { createFirstPoolFromSubgrap } from '../utils/createFirstPoolFromSubgraph';

describe('Use All Routes', () => {
  const chainId = O.some(1);
  const pools = O.some(groupBySymbol(defaultPools));
  const tokens = getMockTokens();
  const tokenA = pipe(tokens, R.lookup('WETH'));
  const tokenB = pipe(tokens, R.lookup('DAI'));
  const tokenC = pipe(tokens, R.lookup('LRC'));
  const aave = pipe(tokens, R.lookup('AAVE'));
  const bal = pipe(tokens, R.lookup('BAL'));
  it('should compare pool correctly', () => {
    const poolA = pipe(
      sequenceT(O.Apply)(tokenB, tokenA, pools),
      O.chain(([tokenA, tokenB, pools]) =>
        createFirstPoolFromSubgrap(tokenA, tokenB)(pools)
      )
    );
    const poolB = pipe(
      sequenceT(O.Apply)(tokenB, tokenA, pools),
      O.chain(([tokenA, tokenB, pools]) =>
        pipe(
          selectFirstPool(tokenA, tokenB)(pools),
          O.map((p) => createPoolFromSubgrap(1)(p, 1, []))
        )
      )
    );

    expect(
      pipe(
        sequenceT(O.Apply)(poolA, poolB),
        O.map(([poolA, poolB]) => eqPool.equals(poolA, poolB)),
        O.isSome
      )
    ).toBe(true);
    const poolC = pipe(
      sequenceT(O.Apply)(tokenB, tokenC, pools),
      O.chain(([tokenA, tokenB, pools]) =>
        pipe(
          selectFirstPool(tokenA, tokenB)(pools),
          O.map((p) => createPoolFromSubgrap(1)(p, 1, []))
        )
      )
    );
    expect(
      pipe(
        sequenceT(O.Apply)(poolA, poolC),
        O.map(([poolA, poolB]) => eqPool.equals(poolA, poolB)),
        O.isSome
      )
    ).toBe(true);
    expect(
      pipe(
        sequenceT(O.Apply)(poolA, poolC),
        O.map(([poolA, poolB]) => eqPool.equals(poolA, poolB))
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": false,
      }
    `);
  });

  it('should compute all routes correctly', () => {
    pipe(
      sequenceT(O.Apply)(pools, chainId, tokenA, tokenB, tokenC),
      O.map(([pools, chainId, tokenA, tokenB, tokenC]) =>
        pipe(createPoolsFromSubgraph(chainId)(pools), (subGraphPool) => {
          expect(tokenA.chainId === chainId).toBe(true);
          const tokenAPools = pipe(
            pools,
            R.collect((k, v) => v),
            A.flatten,
            A.findFirst(
              (p) =>
                p.token0.symbol == tokenA.symbol ||
                p.token1.symbol == tokenA.symbol
            )
          );
          console.log(pools);
        })
      )
    );
    expect(
      pipe(
        sequenceT(O.Apply)(tokenB, tokenC, pools, chainId),
        O.map(([tokenA, tokenB, pools, chainId]) =>
          computeAllRoutes(
            createUniswapToken(tokenA),
            createUniswapToken(tokenB),
            createPoolsFromSubgraph(chainId)(pools),
            2
          )
        )
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [],
      }
    `);
    expect(
      pipe(
        sequenceT(O.Apply)(tokenA, tokenC, pools, chainId),
        O.map(([tokenA, tokenB, pools, chainId]) =>
          computeAllRoutes(
            createUniswapToken(tokenA),
            createUniswapToken(tokenB),
            createPoolsFromSubgraph(chainId)(pools),
            2
          )
        )
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          Route {
            "_midPrice": null,
            "input": Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": undefined,
              "symbol": "WETH",
            },
            "output": Token {
              "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": undefined,
              "symbol": "LRC",
            },
            "pools": Array [
              Pool {
                "fee": 3000,
                "liquidity": JSBI [
                  -1401946112,
                  1054244610,
                  242,
                ],
                "sqrtRatioX96": JSBI [
                  1215137683,
                  -1417409300,
                  47658189,
                ],
                "tickCurrent": -90028,
                "tickDataProvider": NoTickDataProvider {},
                "token0": Token {
                  "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "LRC",
                },
                "token1": Token {
                  "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "WETH",
                },
              },
            ],
            "tokenPath": Array [
              Token {
                "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "WETH",
              },
              Token {
                "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "LRC",
              },
            ],
          },
        ],
      }
    `);
  });

  it('should use all routes correctly', () => {
    const swapPools = pipe(
      sequenceT(O.Apply)(pools, chainId),
      O.map(([pools, chainId]) => createPoolsFromSubgraph(chainId)(pools))
    );
    const tokenIn = pipe(O.some(createUniswapToken), O.ap(tokenA));
    const tokenOut = pipe(O.some(createUniswapToken), O.ap(tokenC));
    const { result, waitForValueToChange } = renderHook(() =>
      useAllRoute({
        chainId,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        pools: swapPools,
      })
    );
    waitForValueToChange(() => result.current);
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          Route {
            "_midPrice": null,
            "input": Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": undefined,
              "symbol": "WETH",
            },
            "output": Token {
              "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": undefined,
              "symbol": "LRC",
            },
            "pools": Array [
              Pool {
                "fee": 3000,
                "liquidity": JSBI [
                  -1401946112,
                  1054244610,
                  242,
                ],
                "sqrtRatioX96": JSBI [
                  1215137683,
                  -1417409300,
                  47658189,
                ],
                "tickCurrent": -90028,
                "tickDataProvider": NoTickDataProvider {},
                "token0": Token {
                  "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "LRC",
                },
                "token1": Token {
                  "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "WETH",
                },
              },
            ],
            "tokenPath": Array [
              Token {
                "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "WETH",
              },
              Token {
                "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "LRC",
              },
            ],
          },
        ],
      }
    `);
  });
});
