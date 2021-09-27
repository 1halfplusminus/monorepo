import {
  createUniswapToken,
  createPool,
  UseUniswapProps,
  useUniswap,
} from './uniswap';
import { pipe } from 'fp-ts/function';
import {
  array as A,
  record as R,
  option as O,
  taskOption as TO,
  function as F,
  task as T,
  number as N,
} from 'fp-ts';
import { FeeAmount } from '../test/shared/constants';
import { createPoolContractFromToken, createPoolFromSubgrap } from './uniswap';
import { renderHook, act } from '@testing-library/react-hooks';
import { Pools_pools } from './__generated__/Pools';
import {
  defaultFetchPools,
  defaultPools,
  groupBySymbol,
  useFetchMore,
  UseFetchMore,
  usePools,
} from './uniswap-subgraph';
import { FACTORY_ADDRESS, Tick, Route } from '@uniswap/v3-sdk';
import { sequenceT } from 'fp-ts/Apply';
import { createPoolContract, useQuoter } from './uniswap';
import { contramap } from 'fp-ts/Ord';
import { getMockTokens } from './utils/getMockTokens';
import { chainId, provider } from './__mocks__/providers';

import fetch from 'node-fetch';
global.fetch = fetch as any;
jest.setTimeout(100000);

describe('Uniswap Lib', () => {
  it('it should fetch price correctly', async () => {
    const tokens = getMockTokens();
    const eth = tokens['BUSD'];
    const dai = tokens['WETH'];

    const tokenA = createUniswapToken(eth);
    const tokenB = createUniswapToken(dai);
    const poolContact = createPoolContractFromToken(provider)(
      tokenB,
      tokenA,
      FeeAmount.MEDIUM,
      FACTORY_ADDRESS
    );
    const pool = await createPool(poolContact, tokenA, tokenB, FeeAmount.LOW);
    console.log(pool.priceOf(tokenB).toFixed());
    /* const trade = Trade.bestTradeExactIn([pool], tokenA, tokenB, currencyOut); */
  });
});

describe('Use uniswap hook', () => {
  const tokens = getMockTokens();
  const tokenA = pipe(tokens, R.lookup('WETH'));
  const tokenB = pipe(tokens, R.lookup('DAI'));
  const useUniswapProps = {
    chainId: O.some(1),
    tokenA: tokenA,
    tokenB: tokenB,
    provider: O.some(provider),
    pools: O.none,
  } as UseUniswapProps;
  it('should fetch more correctly', async () => {
    const fetchMoreProps: UseFetchMore<Pools_pools> = {
      fetchMore: defaultFetchPools,
      first: 0,
      skip: 0,
    };
    const { result, waitForValueToChange } = renderHook(() =>
      useFetchMore(fetchMoreProps)
    );
    await act(async () => {
      let fetchResult = await result.current.fetchMore(1000);
      expect(fetchResult.length == 1000).toBe(true);
      expect(result.current.first).toEqual(1000);
      expect(result.current.skip).toEqual(0);
      expect(result.current.hasMore).toEqual(O.some(true));

      fetchResult = await result.current.fetchMore(500);

      expect(result.current.first).toEqual(500);
      expect(result.current.skip).toEqual(1000);
      expect(result.current.hasMore).toEqual(O.some(true));

      fetchResult = await result.current.fetchMore(500);
      expect(result.current.hasMore).toEqual(O.none);
      /* expect(fetchResult.length == 500).toBe(true);
      expect(result.current.first).toEqual(500);
      expect(result.current.skip).toEqual(1500); */
    });
  });
  it('it should fetch default pools correctly', async () => {
    expect((await defaultFetchPools(0, 50)).length).toEqual(50);
    expect((await defaultFetchPools(10, 40)).length).toEqual(40);
    expect((await defaultFetchPools(1, 1))[0].id).toEqual(
      '0x06bd1af522f43bc270203e96a019b4779195b870'
    );
  });
  it('should use pools correctly', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      usePools({ chainId: O.some(1), first: 0 })
    );
    await waitForValueToChange(() => result.current.pools);

    const length = pipe(
      result.current.pools,
      O.map((r) => R.size(r))
    );
    expect(length).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": 901,
      }
    `);
  });

  it('should trade', async () => {
    const pools = O.some(groupBySymbol(defaultPools));
    const { result, waitForValueToChange, waitForNextUpdate } = renderHook(
      () => ({
        ...useUniswap({
          ...useUniswapProps,
          pools: pools,
        }),
        quoter: useQuoter({
          provider: useUniswapProps.provider,
          chainId: O.some(chainId),
        }),
      })
    );

    await waitForValueToChange(() => result.current.pool, { timeout: 10000 });
    await waitForValueToChange(() => result.current.quoter);
    await pipe(
      sequenceT(O.Apply)(
        pools,
        result.current.pool,
        result.current.tokenAUniswap,
        result.current.tokenBUniswap,
        useUniswapProps.provider,
        result.current.quoter
      ),
      O.map(([pools, p, tokenA, tokenB, provider, q]) => {
        return [
          /*  pipe(
            pools,
            R.toArray,
            A.map((p) => createPoolFromSubgrap(1)(p[1][0]))
          ), */
          /*      pools, */
          tokenA,
          tokenB,
          provider,
          pipe(
            pools,
            R.toArray,
            A.map((p) => p[1]),
            A.flatten,
            A.map((p) => [p, createPoolContract(provider)(p.id)] as const)
          ),
          q,
        ] as const;
      }),
      TO.fromOption,
      TO.chain(([tokenA, tokenB, p, poolsAndContracts, q]) => async () => {
        const sortTickByIndex = pipe(
          N.Ord,
          contramap((t: Tick) => t.index)
        );
        const uniswapPools = await pipe(
          poolsAndContracts,
          A.map(([p, c]) => async () => {
            const ticks = pipe(
              p.ticks,
              A.map((t) => {
                return new Tick({
                  liquidityGross: t.liquidityGross,
                  liquidityNet: t.liquidityNet,
                  index: Number(t.id.split('#')[1]),
                });
              }),
              A.sort(sortTickByIndex)
            );
            try {
              return createPoolFromSubgrap(1)(p, await c.tickSpacing(), []);
            } catch (e) {
              console.log(e);
              console.log('invalid pool for', p.token0.symbol, p.token1.symbol);
            }
          }),
          T.sequenceArray,
          T.map((pools) =>
            pipe(
              [...pools],
              A.filter((t) => t != null)
            )
          )
        )();
        return O.some([uniswapPools, tokenA, tokenB, p, q] as const);
      }),
      TO.chain(([pools, tokenA, tokenB, p, q]) => async () => {
        return O.some([pools, tokenA, tokenB, p, q] as const);
      }),
      TO.chain(([pools, tokenA, tokenB, p, q]) => async () => {
        console.log(tokenA, tokenB);

        const filteredPools = pipe(
          pools,
          A.filter((p) => p.involvesToken(tokenA) || p.involvesToken(tokenB))
        );
        const routes = new Route(filteredPools, tokenB, tokenA);
        console.log('here', routes.tokenPath);
        /*     const trade = await Trade.bestTradeExactIn(
          pools,
          CurrencyAmount.fromRawAmount(tokenA, 1),
          tokenB,
          { maxNumResults: 1, maxHops: 3 }
        );

        console.log(trade); */
        return O.some(pools);
      })
    )();
  });
  it('should use uniswap correctly', async () => {
    const pools = O.some(groupBySymbol(defaultPools));
    const { result, waitForValueToChange, waitForNextUpdate } = renderHook(() =>
      useUniswap({
        ...useUniswapProps,
        pools: pools,
      })
    );

    await waitForValueToChange(() => result.current.pool, { timeout: 10000 });

    await pipe(
      sequenceT(O.Apply)(
        result.current.pool,
        result.current.tokenAUniswap,
        result.current.tokenBUniswap
      ),
      O.map(([pool]) => {
        return pool;
      }),
      TO.fromOption,
      TO.chain((p) => async () => {
        console.log(await result.current.getTokenPrice(tokenA));
        console.log(await result.current.getTokenPrice(tokenB));

        return O.some(p);
      })
    )();
  });
});
