import {
  computePoolAddress,
  FACTORY_ADDRESS,
  Pool,
  tickToPrice,
} from '@uniswap/v3-sdk';
import { IUniswapV3Pool } from '../typechain/IUniswapV3Pool';
import { IUniswapV3Pool__factory } from '../typechain/factories/IUniswapV3Pool__factory';
import { Provider } from '@ethersproject/providers';
import { Address } from 'hardhat-deploy/dist/types';
import { BigNumber } from 'ethers';
import { Token as UToken } from '@uniswap/sdk-core';
import { constant, flow, pipe } from 'fp-ts/function';
import {
  task as T,
  option as O,
  array as A,
  taskOption as TO,
  taskEither as TE,
  either as E,
} from 'fp-ts';
import { FeeAmount } from '../test/shared/constants';
import type { Option } from 'fp-ts/Option';
import { getUniswapDefaultTokenList, Token } from '.';
import { useMemo } from 'react';
import { sequenceT } from 'fp-ts/lib/Apply';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { CurrencyAmount } from '@uniswap/sdk-core';

interface Immutables {
  factory: Address;
  token0: Address;
  token1: Address;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: BigNumber;
}
interface State {
  liquidity: BigNumber;
  sqrtPriceX96: BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}
export const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8';

export const createPoolContract = (provider: Provider) => (
  address: string = poolAddress
) => IUniswapV3Pool__factory.connect(address, provider);
export const createPoolContractFromToken = (provider: Provider) => (
  tokenA: UToken,
  tokenB: UToken,
  feeAmount: FeeAmount
) =>
  pipe(
    computePoolAddress({
      factoryAddress: FACTORY_ADDRESS,
      fee: feeAmount,
      tokenA: tokenA,
      tokenB: tokenB,
    }),
    createPoolContract(provider)
  );
export const createPoolContractFromOptionToken = (
  provider: Option<Provider>
) => (tokenA: Option<UToken>, tokenB: Option<UToken>, feeAmount: FeeAmount) =>
  pipe(
    provider,
    O.map((provider) =>
      pipe(
        tokenA,
        O.map((tokenA) =>
          pipe(
            tokenB,
            O.map((tokenB) =>
              createPoolContractFromToken(provider)(tokenA, tokenB, feeAmount)
            )
          )
        )
      )
    ),
    O.flatten,
    O.flatten
  );

export async function getPoolImmutables(poolContract: IUniswapV3Pool) {
  const PoolImmutables: Immutables = {
    factory: await poolContract.factory(),
    token0: await poolContract.token0(),
    token1: await poolContract.token1(),
    fee: await poolContract.fee(),
    tickSpacing: await poolContract.tickSpacing(),
    maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
  };
  return PoolImmutables;
}
export async function getPoolState(poolContract: IUniswapV3Pool) {
  const slot = await poolContract.slot0();
  const PoolState: State = {
    liquidity: await poolContract.liquidity(),
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };
  return PoolState;
}
export const createUniswapToken = (token: Token) =>
  new UToken(token.chainId, token.address, token.decimals);
export const createUniswapTokenFromOption = (token: Option<Token>) =>
  pipe(
    token ? token : O.none,
    O.map((token) => createUniswapToken(token))
  );
export const getPrice = (baseToken: Token, quoteToken: Token, tick: number) =>
  tickToPrice(
    createUniswapToken(baseToken),
    createUniswapToken(quoteToken),
    tick
  );

export const createPool = (
  poolContract: IUniswapV3Pool,
  baseToken: UToken,
  quoteToken: UToken,
  feeAmount: FeeAmount
) =>
  pipe(
    flow(constant(poolContract), getPoolState),
    T.map(
      (state) =>
        new Pool(
          baseToken,
          quoteToken,
          feeAmount,
          state.sqrtPriceX96.toString(),
          state.liquidity.toString(),
          state.tick
        )
    )
  )();

export interface UseUniswapProps {
  tokenA: Option<Token>;
  tokenB: Option<Token>;
  provider: Option<Provider>;
  chainId: Option<number>;
  feeAmount?: Option<FeeAmount>;
}

export const useUniswap = ({
  tokenA,
  tokenB,
  provider,
  chainId,
  feeAmount = O.some(FeeAmount.LOW),
}: UseUniswapProps) => {
  const [pool, setPool] = useState<Option<Pool>>(O.none);
  const tokenAUniswap = useMemo(() => createUniswapTokenFromOption(tokenA), [
    tokenA,
  ]);
  const tokenBUniswap = useMemo(() => createUniswapTokenFromOption(tokenB), [
    tokenB,
  ]);
  const poolContract = useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(provider, tokenAUniswap, tokenBUniswap, feeAmount),
        O.map(([provider, ...args]) =>
          createPoolContractFromToken(provider)(...args)
        )
      ),
    [tokenAUniswap, tokenBUniswap, provider, feeAmount]
  );
  useEffect(() => {
    pipe(
      sequenceT(O.Apply)(poolContract, tokenAUniswap, tokenBUniswap, feeAmount),
      TE.fromOption(() => 'Invalid props'),
      TE.map((args) =>
        TE.tryCatch(
          () => createPool(...args),
          (e) => {
            console.log(e);
            return e;
          }
        )
      ),
      TE.flatten,
      TE.map((p) => setPool(O.some(p)))
    )();
  }, [poolContract, tokenAUniswap, tokenBUniswap, feeAmount]);
  const getTokenPrice = useCallback(
    (token: Option<Token> | Token) =>
      pipe(
        O.some(token),
        O.flatten,
        (t) => sequenceT(O.Apply)(tokenAUniswap, tokenBUniswap, pool, t),
        O.chain(([tokenAUniswap, tokenBUniswap, pool, token]) =>
          pipe(
            token.address === tokenAUniswap.address
              ? O.some(tokenAUniswap)
              : token.address === tokenBUniswap.address
              ? O.some(tokenBUniswap)
              : O.none,
            O.map((t) => pool.priceOf(t).toFixed())
          )
        )
      ),
    [pool]
  );
  const tokenList = useCallback(
    () =>
      pipe(
        chainId,
        O.fold(
          () => async () => O.some([]),
          (chainId) => () => getUniswapDefaultTokenList(chainId)
        )
      )(),
    [chainId]
  );
  return {
    pool,
    tokenAUniswap,
    tokenBUniswap,
    poolContract,
    getTokenPrice,
    tokenList,
  };
};
