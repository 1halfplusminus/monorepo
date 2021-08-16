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
import { useFetchMore, UseFetchMore } from './uniswap-subgraph';

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
      FeeAmount.MEDIUM
    );
    const pool = await createPool(poolContact, tokenA, tokenB, FeeAmount.LOW);
    console.log(pool.priceOf(tokenB).toFixed());
    /* const trade = Trade.bestTradeExactIn([pool], tokenA, tokenB, currencyOut); */
  });
});

describe('Use uniswap hook', () => {
  const tokens = getMockTokens();
  const tokenA = tokens['WETH'];
  const tokenB = tokens['DOGGE'];
  const props = {
    chainId: O.some(1),
    tokenA: O.some(tokenA),
    tokenB: O.some(tokenB),
    feeAmount: O.some(FeeAmount.LOW),
    provider: O.some(
      new ethers.providers.JsonRpcProvider(
        'https://eth-mainnet.alchemyapi.io/v2/ULYUeg7ZHZIpzzAsWhf7rS80BAnaclQn'
      )
    ),
  } as UseUniswapProps;
  it('should fetch more correctly', async () => {
    const fetchMoreProps: UseFetchMore<void> = {
      fetchMore: async () => F.constNull(),
      first: 0,
      skip: 0,
    };
    const { result, waitForValueToChange } = renderHook(() =>
      useFetchMore(fetchMoreProps)
    );
    result.current.fetchMore(1000);
    await waitForValueToChange(() => result.current.first);
    expect(result.current.first).toEqual(1000);
    expect(result.current.skip).toEqual(0);
    result.current.fetchMore(500);
    await waitForValueToChange(() => result.current.first);
    expect(result.current.first).toEqual(500);
    expect(result.current.skip).toEqual(1000);
    result.current.fetchMore(500);
    await waitForValueToChange(() => result.current.skip);
    expect(result.current.first).toEqual(500);
    expect(result.current.skip).toEqual(1500);
  });
  it('should fetch price correctly', async (done) => {
    const { result, waitForValueToChange } = renderHook(() =>
      useUniswap(props)
    );

    await waitForValueToChange(() => result.current.poolImmutables, {
      timeout: 10000,
    });
    await waitForValueToChange(() => result.current.pool, { timeout: 10000 });
    act(() => {
      pipe(
        sequenceT(O.Apply)(
          result.current.pool,
          result.current.tokenAUniswap,
          result.current.tokenBUniswap
        ),
        O.map(([pool]) => {
          console.log(result.current.getTokenPrice(tokenA));
          console.log(result.current.getTokenPrice(tokenB));
          done();
          return;
        }),
        O.getOrElse(() => done('Error'))
      );
    });
  });
});
