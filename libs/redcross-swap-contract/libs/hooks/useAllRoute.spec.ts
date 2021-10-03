import {
  option as O,
  record as R,
  io as IO,
  function as f,
  array as A,
} from 'fp-ts';
import { defaultPools, groupBySymbol } from '../uniswap-subgraph';
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
import {
  createPoolFromSubgraph,
  createPoolsFromSubgraph,
} from '../utils/createPoolsFromSubgraph';
import { createTokensMapFromPools } from '../utils/createTokensMapFromPools';

describe('Use All Routes', () => {
  const _chainId = 1;
  const _pools = groupBySymbol(defaultPools);
  const _uniswapPools = pipe(_pools, createPoolsFromSubgraph(_chainId));
  const chainId = O.some(_chainId);
  const pools = O.some(_pools);
  const tokens = createTokensMapFromPools(_chainId)(_pools);
  const uniswapPools = O.some(_uniswapPools);
  const tokenA = pipe(tokens, R.lookup('WETH'));
  const tokenB = pipe(tokens, R.lookup('DAI'));
  const tokenC = pipe(tokens, R.lookup('LRC'));
  const aave = pipe(tokens, R.lookup('AAVE'));
  const bal = pipe(tokens, R.lookup('BAL'));
  it('should compare pool correctly', () => {
    const poolA = pipe(
      sequenceT(O.Apply)(tokenA, tokenB),
      O.chain(([tokenA, tokenB]) =>
        pipe(
          _uniswapPools,
          A.findFirst((t) => t.involvesToken(tokenA) && t.involvesToken(tokenB))
        )
      )
    );
    const poolB = pipe(
      sequenceT(O.Apply)(tokenA, tokenB),
      O.chain(([tokenA, tokenB]) =>
        pipe(
          _uniswapPools,
          A.findFirst((t) => t.involvesToken(tokenA) && t.involvesToken(tokenB))
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
      sequenceT(O.Apply)(tokenA, tokenC),
      O.chain(([tokenA, tokenB]) =>
        pipe(
          _uniswapPools,
          A.findFirst((t) => t.involvesToken(tokenA) && t.involvesToken(tokenB))
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
            _uniswapPools,
            A.findFirst((p) => p.involvesToken(tokenA))
          );

          const tokenBPools = pipe(
            _uniswapPools,
            A.findFirst((p) => p.involvesToken(tokenB))
          );

          const tokenCPools = pipe(
            sequenceT(O.Apply)(aave),
            O.map(([tokenA]) =>
              pipe(
                _uniswapPools,
                A.filter((p) => p.involvesToken(tokenA)),
                A.map((p) => p.token0.symbol + ' => ' + p.token1.symbol)
              )
            )
          );
          console.log(tokenCPools);
        })
      )
    );
    expect(
      pipe(
        sequenceT(O.Apply)(tokenB, tokenC, pools, chainId),
        O.map(([tokenA, tokenB, pools, chainId]) =>
          computeAllRoutes(
            tokenA,
            tokenB,
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
            tokenA,
            tokenB,
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
    const tokenIn = tokenA;
    const tokenOut = tokenC;
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
