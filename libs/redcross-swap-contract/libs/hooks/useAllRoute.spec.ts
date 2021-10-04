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
import { route } from 'next/dist/next-server/server/router';

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
          pipe(
            computeAllRoutes(
              tokenA,
              tokenB,
              createPoolsFromSubgraph(chainId)(pools),
              1
            ),
            A.map((r) => r.tokenPath.map((t) => t.symbol))
          )
        )
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          Array [
            "DAI",
            "LRC",
          ],
          Array [
            "DAI",
            "USDC",
            "LRC",
          ],
          Array [
            "DAI",
            "USDC",
            "LRC",
          ],
          Array [
            "DAI",
            "USDC",
            "LRC",
          ],
          Array [
            "DAI",
            "WETH",
            "LRC",
          ],
          Array [
            "DAI",
            "WETH",
            "LRC",
          ],
          Array [
            "DAI",
            "WETH",
            "LRC",
          ],
        ],
      }
    `);
    expect(
      pipe(
        sequenceT(O.Apply)(tokenA, tokenC, pools, chainId),
        O.map(([tokenA, tokenB, pools, chainId]) =>
          pipe(
            computeAllRoutes(
              tokenA,
              tokenB,
              createPoolsFromSubgraph(chainId)(pools),
              2
            ),
            A.map((r) => r.tokenPath.map((t) => t.symbol))
          )
        )
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          Array [
            "WETH",
            "DAI",
            "LRC",
          ],
          Array [
            "WETH",
            "DAI",
            "LRC",
          ],
          Array [
            "WETH",
            "DAI",
            "LRC",
          ],
          Array [
            "WETH",
            "LRC",
          ],
          Array [
            "WETH",
            "USDC",
            "LRC",
          ],
          Array [
            "WETH",
            "USDC",
            "LRC",
          ],
          Array [
            "WETH",
            "USDC",
            "LRC",
          ],
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
    expect(
      pipe(
        result.current,
        O.map((routes) =>
          pipe(
            routes,
            A.map((r) => r.tokenPath.map((t) => t.symbol))
          )
        )
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          Array [
            "WETH",
            "DAI",
            "LRC",
          ],
          Array [
            "WETH",
            "DAI",
            "LRC",
          ],
          Array [
            "WETH",
            "DAI",
            "LRC",
          ],
          Array [
            "WETH",
            "LRC",
          ],
          Array [
            "WETH",
            "USDC",
            "LRC",
          ],
          Array [
            "WETH",
            "USDC",
            "LRC",
          ],
          Array [
            "WETH",
            "USDC",
            "LRC",
          ],
        ],
      }
    `);
  });
});
