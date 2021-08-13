import { gql, QueryResult, ApolloClient, InMemoryCache } from '@apollo/client';
import { Pools, Pools_pools } from './__generated__/Pools';
import { pipe } from 'fp-ts/function';
import { Token } from './index';
import {
  nonEmptyArray as NEA,
  option as O,
  record as R,
  array as A,
  task as T,
} from 'fp-ts';
import type { Option } from 'fp-ts/Option';
import type { Task } from 'fp-ts/Task';
import { Provider, useEffect, useState } from 'react';

import { sequenceT } from 'fp-ts/Apply';
import { createPoolContract } from './uniswap';
import TokenList from '../../swap-ui/src/lib/token-list/token-list';
import { QUERY_POOLS_RESULT } from './__mocks__/pools';
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
  fetchPools?: Task<Pools_pools[]>;
}
const queryPools = (apolloClient: ApolloClient<unknown>) =>
  pipe(
    () =>
      apolloClient.query<Pools>({
        query: QUERY_POOLS,
      }),
    T.map((r) => selectPools(r))
  );

const defaultFetchPool = async () => pipe(QUERY_POOLS_RESULT, selectPools);

export const usePools = ({
  chainId,
  fetchPools = defaultFetchPool,
}: UsePools) => {
  const [pools, setPools] = useState<Option<PoolsList>>(O.none);
  useEffect(() => {
    pipe(
      fetchPools,
      T.map((r) => pipe(r, groupBySymbol, O.some, setPools))
    )();
  }, [chainId]);
  return { pools };
};
export interface UsePool {
  tokenA: Option<Token>;
  tokenB: Option<Token>;
  pools: Option<PoolsList>;
}
export const usePool = ({ tokenA, tokenB, pools }: UsePool) => {
  const [pool, setPool] = useState<Option<Pools_pools>>(O.none);
  useEffect(() => {
    pipe(
      sequenceT(O.Apply)(tokenA, tokenB, pools),
      O.chain(([tokenA, tokenB, pools]) =>
        pipe(pools, selectPool(tokenA.symbol, tokenB.symbol))
      ),
      O.chain((r) => A.head(r)),
      setPool
    );
  }, [tokenA, tokenB, pools]);
  return { pool };
};

export const intersectTokenList = (tokenList: Option<Array<Option<Token>>>) => (
  pools: Pools_pools[]
) =>
  pipe(
    tokenList,
    O.map((list) =>
      pipe(
        list,
        A.map((r) =>
          pipe(
            r,
            O.chain((t) =>
              pipe(
                pools,
                A.findFirst(
                  (p) => p.token0.id === t.address || p.token1.id === t.address
                ),
                O.map(() => t)
              )
            )
          )
        ),
        A.reduce([] as Array<O.Some<Token>>, (acc, v) =>
          O.isSome(v) ? [...acc, v] : acc
        )
      )
    )
  );
