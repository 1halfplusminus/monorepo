import {
  createUniswapToken,
  createPool,
  useUniswap,
  UseUniswapProps,
} from './uniswap';
import { pipe } from 'fp-ts/function';
import { filterByChainId, getPoolImmutables } from './index';
import {
  array as A,
  record as R,
  option as O,
  nonEmptyArray as NEA,
  taskOption as TO,
  function as F,
  task as T,
} from 'fp-ts';
import { ethers } from 'ethers';
import { FeeAmount } from '../test/shared/constants';
import { tokenList } from './__mocks__/index';
import { createPoolContractFromToken, getPrice } from './uniswap';
import fetch from 'node-fetch';
import { renderHook, act } from '@testing-library/react-hooks';
import { sequenceT } from 'fp-ts/lib/Apply';
import { CurrencyAmount } from '@uniswap/sdk-core';
import { Pools_pools } from './__generated__/Pools';
import { QUERY_POOLS_RESULT } from './__mocks__/pools';
import {
  defaultFetchPools,
  useFetchMore,
  UseFetchMore,
  usePools,
} from './uniswap-subgraph';
import { FACTORY_ADDRESS } from '@uniswap/v3-sdk';

global.fetch = fetch as any;
jest.setTimeout(100000);

const getMockTokens = () =>
  pipe(
    tokenList,
    filterByChainId(1),
    NEA.groupBy((t) => t.symbol),
    R.map((v) => v[0])
  );

describe('Uniswap Lib', () => {
  it('it should fetch price correctly', async () => {
    const tokens = getMockTokens();
    const eth = tokens['BUSD'];
    const dai = tokens['WETH'];

    const provider = new ethers.providers.JsonRpcProvider(
      'https://eth-mainnet.alchemyapi.io/v2/ULYUeg7ZHZIpzzAsWhf7rS80BAnaclQn'
    );
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
    provider: O.some(
      new ethers.providers.JsonRpcProvider(
        'https://eth-mainnet.alchemyapi.io/v2/ULYUeg7ZHZIpzzAsWhf7rS80BAnaclQn'
      )
    ),
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
  it('should use uniswap correctly', async () => {
    const { pools } = usePools({ chainId: O.some(1) });
    const { result, waitForValueToChange, waitForNextUpdate } = renderHook(() =>
      useUniswap({ ...useUniswapProps, pools })
    );
    await waitForValueToChange(() => result.current.pool, {
      timeout: 100000,
    });
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
        await waitForNextUpdate({
          timeout: 1000000,
        });
        return O.some(p);
      })
    )();
    /* await pipe(
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
        await waitForNextUpdate({
          timeout: 1000000,
        });
        return O.some(p);
      })
    )(); */
  });
});
