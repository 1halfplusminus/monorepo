import {
  createUniswapToken,
  createPool,
  useUniswap,
  UseUniswapProps,
} from './uniswap';
import { pipe } from 'fp-ts/function';
import { filterByChainId } from './index';
import {
  array as A,
  record as R,
  option as O,
  nonEmptyArray as NEA,
  taskOption as TO,
} from 'fp-ts';
import { ethers } from 'ethers';
import { FeeAmount } from '../test/shared/constants';
import { tokenList } from './__mocks__/index';
import { createPoolContractFromToken, getPrice } from './uniswap';
import fetch from 'node-fetch';
import { renderHook, act } from '@testing-library/react-hooks';
import { DAI, ETH } from './__mocks__/tokens';
import { sequenceT } from 'fp-ts/lib/Apply';
import { CurrencyAmount } from '@uniswap/sdk-core';

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
    const eth = tokens['WETH'];
    const dai = tokens['DAI'];

    const provider = new ethers.providers.JsonRpcProvider(
      'https://eth-mainnet.alchemyapi.io/v2/ULYUeg7ZHZIpzzAsWhf7rS80BAnaclQn'
    );
    const tokenA = createUniswapToken(eth);
    const tokenB = createUniswapToken(dai);
    const poolContact = createPoolContractFromToken(provider)(
      tokenA,
      tokenB,
      FeeAmount.LOW
    );
    const pool = await createPool(poolContact, tokenA, tokenB, FeeAmount.LOW);
    console.log(pool.priceOf(tokenB).toFixed());
    /* const trade = Trade.bestTradeExactIn([pool], tokenA, tokenB, currencyOut); */
  });
});

describe('Use uniswap hook', () => {
  const tokens = getMockTokens();
  const eth = tokens['WETH'];
  const dai = tokens['DAI'];
  const props = {
    tokenA: O.some(eth),
    tokenB: O.some(dai),
    feeAmount: O.some(FeeAmount.LOW),
    provider: O.some(
      new ethers.providers.JsonRpcProvider(
        'https://eth-mainnet.alchemyapi.io/v2/ULYUeg7ZHZIpzzAsWhf7rS80BAnaclQn'
      )
    ),
  } as UseUniswapProps;

  it('should fetch price correctly', async (done) => {
    const { result, waitForValueToChange } = renderHook(() =>
      useUniswap(props)
    );
    await waitForValueToChange(() => result.current.pool, { timeout: 10000 });
    act(() => {
      pipe(
        sequenceT(O.Apply)(
          result.current.pool,
          result.current.tokenAUniswap,
          result.current.tokenBUniswap
        ),
        O.map(([pool, tokenA, tokenB]) =>
          TO.tryCatch(() =>
            pool.getInputAmount(CurrencyAmount.fromRawAmount(tokenB, 1))
          )
        ),
        TO.fromOption,
        TO.flatten,
        TO.map((r) => {
          console.log(r[0].toFixed());

          done();
        }),
        TO.getOrElse(() => async () => done('error'))
        /*   O.map(([pool, tokenA, tokenB]) => {
          expect(pool).toBeTruthy();

          return pool.priceOf(tokenB).toFixed();
        }),
        O.map((r) => {
          expect(r).toBeTruthy();
          done();
        }),
        O.getOrElse(() => done('Error')) */
      )();
    });
  });
});
