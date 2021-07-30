import {
  getPrice,
  createPoolContract,
  createUniswapToken,
  getPoolState,
  createPool,
} from './uniswap';
import { pipe } from 'fp-ts/function';
import { getUniswapDefaultTokenList, Token, filterByChainId } from './index';
import {
  array as A,
  record as R,
  option as O,
  nonEmptyArray as NEA,
} from 'fp-ts';
import { ethers } from 'ethers';
import {
  computePoolAddress,
  FACTORY_ADDRESS,
  Pool,
  Trade,
} from '@uniswap/v3-sdk';
import { FeeAmount } from '../test/shared/constants';
import { CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { tokenList } from './__mocks__/index';
import { createPoolContractFromToken } from './uniswap';

jest.setTimeout(100000);

describe('Uniswap Lib', () => {
  it('it should fetch price correctly', async () => {
    const tokens = pipe(
      tokenList,
      filterByChainId(1),
      NEA.groupBy((t) => t.symbol),
      R.map((v) => v[0])
    );
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
