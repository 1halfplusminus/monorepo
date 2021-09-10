import { getMockTokens } from '../utils/getMockTokens';
import { option as O, record as R, function as F, array as A } from 'fp-ts';
import {
  defaultPools,
  groupBySymbol,
  selectPoolByToken,
} from '../uniswap-subgraph';
import { pipe } from 'fp-ts/function';
import { createPoolFromSubgrap, createUniswapToken } from '../uniswap';
import { sequenceT } from 'fp-ts/lib/Apply';
import { computeAllRoutes, eqPool } from './useAllRoute';
import { Pools_pools } from '../__generated__/Pools';
import { TokenListItem, Token } from '../index';
import type { NonEmptyArray } from 'fp-ts/NonEmptyArray';
describe('Use All Routes', () => {
  const pools = O.some(groupBySymbol(defaultPools));
  const tokens = getMockTokens();
  const tokenA = pipe(tokens, R.lookup('WETH'));
  const tokenB = pipe(tokens, R.lookup('DAI'));
  const tokenC = pipe(tokens, R.lookup('LRC'));
  const selectFirstPool = (t1: TokenListItem, t2: TokenListItem) => (
    pools: Record<string, NonEmptyArray<Pools_pools>>
  ) =>
    pipe(
      selectPoolByToken(t1, t2)(pools),
      O.map((r) => A.head(r)),
      O.flatten
    );
  const createFirstPoolFromSubgrap = (
    tokenA: TokenListItem,
    tokenB: TokenListItem
  ) =>
    F.flow(
      (pools: Record<string, NonEmptyArray<Pools_pools>>) =>
        selectFirstPool(tokenA, tokenB)(pools),
      O.map((p) => createPoolFromSubgrap(1)(p, 1, []))
    );
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
        sequenceT(O.Apply)(tokenA, tokenC, pools),
        O.map(([tokenA, tokenB, pools]) =>
          computeAllRoutes(
            createUniswapToken(tokenA),
            createUniswapToken(tokenB),
            pipe(
              pools,
              R.toArray,
              A.map(([key, p]) =>
                pipe(
                  p,
                  A.map((p) => createPoolFromSubgrap(1)(p, 1, []))
                )
              ),
              A.flatten
            ),
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
});
