import { gql, QueryResult } from '@apollo/client';
import { Pools, Pools_pools } from './__generated__/Pools';
import { pipe } from 'fp-ts/function';
import { Token } from './index';
import { nonEmptyArray as NEA, option as O, record as R } from 'fp-ts';
import type { Option } from 'fp-ts/Option';
import type { Task } from 'fp-ts/Task';
import { useEffect, useState } from 'react';
import { QUERY_POOLS_RESULT } from './__mocks__/tokens';

export const QUERY_POOLS = gql`
  query Pools {
    pools(first: 1) {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      feeTier
      token0Price
      token1Price
    }
  }
`;
export type PoolsList = Record<string, Pools_pools[]>;

export const createPoolIndex = (tokenASymbol: string, tokenBSymbol: string) =>
  tokenASymbol > tokenBSymbol
    ? tokenASymbol + '-' + tokenBSymbol
    : tokenBSymbol + '-' + tokenASymbol;

export const selectPoolByToken = (tokenA: Token, tokenB: Token) => (
  pools: PoolsList
) => pipe(createPoolIndex(tokenA.symbol, tokenB.symbol), (key) => pools[key]);

export const selectPool = (tokenASymbol: string, tokenBSymbol: string) => (
  pools: PoolsList
) => pipe(pools, R.lookup(createPoolIndex(tokenASymbol, tokenBSymbol)));

export const selectPools = (result: Pick<QueryResult<Pools>, 'data'>) =>
  result.data.pools;

export const groupBySymbol = (pools: Pools_pools[]) =>
  pipe(
    pools,
    NEA.groupBy((p) => createPoolIndex(p.token0.symbol, p.token1.symbol))
  );

export interface UsePools {
  chainId: Option<number>;
  fetchPools: Task<Pools>;
}
export const usePools = ({ chainId }: UsePools) => {
  const [pools, setPools] = useState<Option<PoolsList>>();
  useEffect(() => {
    pipe(QUERY_POOLS_RESULT, selectPools, groupBySymbol, O.some, setPools);
  }, [chainId]);
  return { pools };
};
export interface UsePool {
  tokenA: Option<Token>;
  tokenB: Option<Token>;
}
export const usePool = ({ tokenA }: UsePool) => {
  return {};
};
