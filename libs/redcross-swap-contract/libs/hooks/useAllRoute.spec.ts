import { getMockTokens } from '../utils/getMockTokens';
import { option as O, record as R, io as IO, function as f } from 'fp-ts';
import { defaultPools, groupBySymbol } from '../uniswap-subgraph';
import { pipe } from 'fp-ts/function';
import { createPoolFromSubgrap, createUniswapToken } from '../uniswap';
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
    expect(
      pipe(
        sequenceT(O.Apply)(tokenA, tokenC, pools, chainId),
        O.map(([tokenA, tokenB, pools, chainId]) =>
          computeAllRoutes(
            createUniswapToken(tokenA),
            createUniswapToken(tokenB),
            createPoolsFromSubgraph(chainId)(pools),
            1
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
                  -1073741824,
                  2062539224,
                  422112,
                ],
                "sqrtRatioX96": JSBI [
                  0,
                  -1553351232,
                  72346073,
                ],
                "tickCurrent": -81679,
                "tickDataProvider": TickListDataProvider {
                  "ticks": Array [],
                },
                "token0": Token {
                  "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "DAI",
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
              Pool {
                "fee": 3000,
                "liquidity": JSBI [
                  0,
                  1387581864,
                  1857041,
                ],
                "sqrtRatioX96": JSBI [
                  0,
                  1653137408,
                  1554581166,
                  1,
                ],
                "tickCurrent": 6178,
                "tickDataProvider": TickListDataProvider {
                  "ticks": Array [],
                },
                "token0": Token {
                  "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "DAI",
                },
                "token1": Token {
                  "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "LRC",
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
                "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "DAI",
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
                "fee": 500,
                "liquidity": JSBI [
                  -1073741824,
                  335229041,
                  202846,
                ],
                "sqrtRatioX96": JSBI [
                  0,
                  1169736960,
                  72434165,
                ],
                "tickCurrent": -81655,
                "tickDataProvider": TickListDataProvider {
                  "ticks": Array [],
                },
                "token0": Token {
                  "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "DAI",
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
              Pool {
                "fee": 3000,
                "liquidity": JSBI [
                  0,
                  1387581864,
                  1857041,
                ],
                "sqrtRatioX96": JSBI [
                  0,
                  1653137408,
                  1554581166,
                  1,
                ],
                "tickCurrent": 6178,
                "tickDataProvider": TickListDataProvider {
                  "ticks": Array [],
                },
                "token0": Token {
                  "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "DAI",
                },
                "token1": Token {
                  "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "LRC",
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
                "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "DAI",
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
    const { result, waitForValueToChange } = renderHook(() =>
      useAllRoute({
        chainId,
        tokenIn: pipe(O.some(createUniswapToken), O.ap(tokenA)),
        tokenOut: pipe(O.some(createUniswapToken), O.ap(tokenB)),
        pools: swapPools,
      })
    );
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
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": undefined,
              "symbol": "DAI",
            },
            "pools": Array [
              Pool {
                "fee": 500,
                "liquidity": JSBI [
                  870013884,
                  257650,
                ],
                "sqrtRatioX96": JSBI [
                  0,
                  1673411904,
                  85361484,
                ],
                "tickCurrent": -78371,
                "tickDataProvider": null,
                "token0": Token {
                  "address": "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "FEI",
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
              Pool {
                "fee": 500,
                "liquidity": JSBI [
                  0,
                  1669124416,
                  71364563,
                ],
                "sqrtRatioX96": JSBI [
                  0,
                  -195559424,
                  666765,
                  1,
                ],
                "tickCurrent": 3,
                "tickDataProvider": null,
                "token0": Token {
                  "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "DAI",
                },
                "token1": Token {
                  "address": "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "FEI",
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
                "address": "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "FEI",
              },
              Token {
                "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "DAI",
              },
            ],
          },
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
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": undefined,
              "symbol": "DAI",
            },
            "pools": Array [
              Pool {
                "fee": 3000,
                "liquidity": JSBI [
                  -1772979131,
                  56030,
                ],
                "sqrtRatioX96": JSBI [
                  0,
                  1505755136,
                  935802351,
                  262,
                ],
                "tickCurrent": 111389,
                "tickDataProvider": null,
                "token0": Token {
                  "address": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
                  "chainId": 1,
                  "decimals": 8,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "cDAI",
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
              Pool {
                "fee": 500,
                "liquidity": JSBI [
                  -448724992,
                  -354221413,
                  18,
                ],
                "sqrtRatioX96": JSBI [
                  0,
                  1140850688,
                  1607029680,
                  14775,
                ],
                "tickCurrent": 192023,
                "tickDataProvider": null,
                "token0": Token {
                  "address": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
                  "chainId": 1,
                  "decimals": 8,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "cDAI",
                },
                "token1": Token {
                  "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                  "chainId": 1,
                  "decimals": 18,
                  "isNative": false,
                  "isToken": true,
                  "name": undefined,
                  "symbol": "DAI",
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
                "address": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
                "chainId": 1,
                "decimals": 8,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "cDAI",
              },
              Token {
                "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "chainId": 1,
                "decimals": 18,
                "isNative": false,
                "isToken": true,
                "name": undefined,
                "symbol": "DAI",
              },
            ],
          },
        ],
      }
    `);
  });
});
