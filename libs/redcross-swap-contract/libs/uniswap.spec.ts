import { tokenList } from './__mocks__/';
import {
  getPrice,
  createPoolContract,
  getPoolImmutables,
  createUniswapToken,
  getPoolState,
} from './uniswap';
import { pipe } from 'fp-ts/function';
import {
  getUniswapDefaultTokenList,
  groupByChaindId,
  groupBySymbol,
  Token,
} from './index';
import {
  array as A,
  record as R,
  option as O,
  nonEmptyArray as NEA,
} from 'fp-ts';
import { ethers } from 'ethers';
import { computePoolAddress, FACTORY_ADDRESS, Pool } from '@uniswap/v3-sdk';
import { FeeAmount } from '../test/shared/constants';
import { CurrencyAmount } from '@uniswap/sdk-core';

jest.setTimeout(100000);

describe('Uniswap Lib', () => {
  it('it should fetch price correctly', async () => {
    const tokens = pipe(
      await pipe(getUniswapDefaultTokenList(1)),
      O.fold(
        () => [] as Token[],
        (r) =>
          pipe(
            r,
            A.reduce<O.Option<Token>, Token[]>([], (acc, item) =>
              O.isSome(item) ? [item.value, ...acc] : acc
            )
          )
      ),
      NEA.groupBy((t) => t.name),
      R.map((v) => v[0])
    );
    const eth = tokens['WETH'];
    const dai = tokens['DAI'];

    const provider = new ethers.providers.JsonRpcProvider(
      'https://eth-mainnet.alchemyapi.io/v2/ULYUeg7ZHZIpzzAsWhf7rS80BAnaclQn'
    );
    const TokenA = createUniswapToken(eth);
    const TokenB = createUniswapToken(dai);
    const poolAddress = computePoolAddress({
      factoryAddress: FACTORY_ADDRESS,
      fee: FeeAmount.LOW,
      tokenA: TokenA,
      tokenB: TokenB,
    });
    const pool = createPoolContract(provider)(poolAddress);
    const state = await getPoolState(pool);
    const price = getPrice(eth, dai, state.tick);
    console.log(price.quote(CurrencyAmount.fromRawAmount(TokenA, 1)).toFixed());
  });
});
