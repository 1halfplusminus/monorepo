import {
  computePoolAddress,
  Pool,
  Tick,
  TickListDataProvider,
  tickToPrice,
} from '@uniswap/v3-sdk';
import { IUniswapV3Pool } from '../typechain/IUniswapV3Pool';
import { IUniswapV3Pool__factory } from '../typechain/factories/IUniswapV3Pool__factory';
import { Provider } from '@ethersproject/providers';
import { Address } from 'hardhat-deploy/dist/types';
import { BigNumber, ethers } from 'ethers';
import { Token as UToken } from '@uniswap/sdk-core';
import { constant, flow, pipe } from 'fp-ts/function';
import {
  task as T,
  option as O,
  array as A,
  taskOption as TO,
  taskEither as TE,
  either as E,
  record as R,
  function as F,
} from 'fp-ts';
import { FeeAmount } from '../test/shared/constants';
import type { Option } from 'fp-ts/Option';
import { Token } from '.';
import { useMemo } from 'react';
import { sequenceT } from 'fp-ts/lib/Apply';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import {
  usePool,
  PoolsList,
  poolSelector,
  eqPoolTokenToken,
} from './uniswap-subgraph';
import { useIsMounted } from './index';
import { IQuoter__factory } from '../typechain/factories/IQuoter__factory';
import {
  Pools_pools,
  Pools_pools_token0,
  Pools_pools_token1,
} from './__generated__/Pools';

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
export interface UseQuoter {
  provider: Option<Provider>;
}
export const useQuoter = ({ provider }: UseQuoter) => {
  const quoter = useMemo(
    () =>
      pipe(
        provider,
        O.map((p) =>
          IQuoter__factory.connect(
            '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
            p
          )
        )
      ),
    [provider]
  );
  return quoter;
};
export const createPoolContract = (provider: Provider) => (
  address: string = poolAddress
) => IUniswapV3Pool__factory.connect(address, provider);
export const createPoolContractFromToken = (provider: Provider) => (
  tokenA: UToken,
  tokenB: UToken,
  feeAmount: FeeAmount,
  factoryAddress: Address
) =>
  pipe(
    computePoolAddress({
      factoryAddress: factoryAddress,
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
              createPoolContractFromToken(provider)(
                tokenA,
                tokenB,
                feeAmount,
                ''
              )
            )
          )
        )
      )
    ),
    O.flatten,
    O.flatten
  );

export async function getPoolImmutables(poolContract: IUniswapV3Pool) {
  const [
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  ] = await Promise.all([
    await poolContract.factory(),
    await poolContract.token0(),
    await poolContract.token1(),
    await poolContract.fee(),
    await poolContract.tickSpacing(),
    await poolContract.maxLiquidityPerTick(),
  ]);
  const poolImmutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  };
  return poolImmutables;
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
  new UToken(
    token.chainId,
    token.address,
    token.decimals,
    poolSelector(token),
    token.fullName
  );

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
export const createTokenFromSubgraph = (chainId: number) => (
  token: Pools_pools_token0 | Pools_pools_token1
) => pipe(new UToken(chainId, token.id, Number(token.decimals), token.symbol));

export const createPoolFromSubgrap = (chainId: number) => (
  pool: Pools_pools,
  tickSpacing: number,
  ticks: Tick[]
) =>
  pipe(
    new Pool(
      createTokenFromSubgraph(chainId)(pool.token0),
      createTokenFromSubgraph(chainId)(pool.token1),
      Number(pool.feeTier),
      Number(pool.sqrtPrice),
      Number(pool.liquidity),
      Number(pool.tick),
      new TickListDataProvider(ticks, tickSpacing)
    )
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
const eqTokenUToken = (token: Token) => (uToken: UToken) =>
  token.address.toUpperCase() == uToken.address.toUpperCase();
export interface UseUniswapProps {
  tokenA: Option<Token>;
  tokenB: Option<Token>;
  provider: Option<Provider>;
  pools: Option<PoolsList>;
  fetchPoolsImmutable?: (contrat: IUniswapV3Pool) => Promise<Immutables>;
}
export const useUniswapPools = () => {};
export const useUniswap = ({
  tokenA,
  tokenB,
  provider,
  fetchPoolsImmutable = getPoolImmutables,
  pools,
}: UseUniswapProps) => {
  const isMounted = useIsMounted();
  const [pool, setPool] = useState<Option<Pool>>(O.none);
  const [poolImmutables, setPoolImmutables] = useState<Option<Immutables>>(
    O.none
  );
  const tokenAUniswap = useMemo(() => createUniswapTokenFromOption(tokenA), [
    tokenA,
  ]);
  const tokenBUniswap = useMemo(() => createUniswapTokenFromOption(tokenB), [
    tokenB,
  ]);
  const { pool: poolInfo } = usePool({ tokenA, tokenB, pools });

  const poolContract = useMemo(
    () =>
      pipe(
        O.some(createPoolContract),
        O.ap(provider),
        O.ap(
          pipe(
            poolInfo,
            O.map((p) => p.id)
          )
        )
      ),
    [poolInfo, provider]
  );
  useEffect(() => {
    pipe(
      poolContract,
      TO.fromOption,
      TO.chain((p) => TO.tryCatch(() => fetchPoolsImmutable(p))),
      TO.chain((r) => async () =>
        pipe(
          r,
          O.fromPredicate(() => isMounted.current)
        )
      ),
      TO.map((r) => setPoolImmutables(O.some(r)))
    )();
    return () => {
      setPoolImmutables(O.none);
    };
  }, [poolContract]);
  useEffect(() => {
    pipe(
      sequenceT(O.Apply)(poolContract, tokenAUniswap, tokenBUniswap, poolInfo),
      TO.fromOption,
      TO.chain(([poolContract, tokenA, tokenB, poolInfo]) =>
        TO.tryCatch(() =>
          createPool(poolContract, tokenA, tokenB, Number(poolInfo.feeTier))
        )
      ),
      TO.chain((r) => async () =>
        pipe(
          r,
          O.fromPredicate(() => isMounted.current)
        )
      ),
      TO.map((p) => setPool(O.some(p)))
    )();
    return () => {
      setPool(O.none);
    };
  }, [poolContract, tokenAUniswap, tokenBUniswap, poolInfo]);
  const getTokenPrice = useCallback(
    async (token: Option<Token> | Token) =>
      pipe(
        '_tag' in token ? token : O.some(token),
        (t) => sequenceT(O.Apply)(tokenAUniswap, tokenBUniswap, t, poolInfo),
        O.chain(([tokenAUniswap, tokenBUniswap, token, poolInfo]) =>
          pipe(
            eqPoolTokenToken(poolInfo.token0, token)
              ? O.some(poolInfo.token0Price)
              : eqPoolTokenToken(poolInfo.token1, token)
              ? O.some(poolInfo.token1Price)
              : O.none,
            O.map((t) => {
              console.log(t);
              return ethers.FixedNumber.fromString(
                Number(t).toFixed(18),
                'fixed128x18'
              ).toString();
            })
          )
        )
      ),
    [pool, tokenAUniswap, tokenBUniswap, poolInfo]
  );

  return {
    pool,
    tokenAUniswap,
    tokenBUniswap,
    poolContract,
    getTokenPrice,
    poolImmutables,
    poolInfo,
  };
};
