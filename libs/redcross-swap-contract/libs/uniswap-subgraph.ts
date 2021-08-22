import { gql, QueryResult, ApolloClient } from '@apollo/client';
import {
  Pools,
  Pools_pools,
  Pools_pools_token0,
  Pools_pools_token1,
} from './__generated__/Pools';
import { pipe } from 'fp-ts/function';
import { Token } from './index';
import {
  nonEmptyArray as NEA,
  option as O,
  record as R,
  array as A,
  task as T,
  eq as EQ,
  function as F,
  taskOption as TO,
} from 'fp-ts';
import type { Option } from 'fp-ts/Option';
import type { Task } from 'fp-ts/Task';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { sequenceT } from 'fp-ts/Apply';
import { QUERY_POOLS_RESULT } from './__mocks__/pools';

export const QUERY_POOLS = gql`
  query Pools($skip: Int, $fist: Int) {
    pools(skip: $skip, first: $fist, orderBy: liquidity, orderDirection: desc) {
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
  fetchPools?: (skip: number, first: number) => Promise<Pools_pools[]>;
  first?: number;
  more?: number;
}
const queryPools = (apolloClient: ApolloClient<unknown>) => (
  skip: number,
  first: number
) =>
  pipe(
    () =>
      apolloClient.query<Pools>({
        query: QUERY_POOLS,
        variables: { skip, first },
      }),
    T.map((r) => selectPools(r))
  );

export const defaultPools = pipe(QUERY_POOLS_RESULT, selectPools);

export const defaultFetchPools = async (skip: number, first: number) =>
  defaultPools.slice(skip, skip + first);

export interface UseFetchMore<T> {
  first: number;
  skip?: number;
  fetchMore: (skip: number, first: number) => Promise<Array<T>>;
}
export const useFetchMore = <T>({
  skip: skipDefault = 0,
  first: firstDefault,
  fetchMore: fetchMoreCallback,
}: UseFetchMore<T>) => {
  const [{ first, skip, hasMore }, setPagination] = useState({
    skip: skipDefault,
    first: firstDefault,
    hasMore: O.none as O.Option<boolean>,
  });
  const fetchMore = useCallback(
    (more: number) =>
      pipe(
        () => fetchMoreCallback(skip, first + more),
        T.map((r) =>
          pipe(
            setPagination({
              first: more,
              skip: skip + first,
              hasMore: O.some(r.length > 0),
            }),
            F.flow(F.constant(r))
          )
        )
      )(),
    [first, skip, fetchMoreCallback]
  );
  const hasMoreMemo = useMemo(
    () =>
      pipe(
        hasMore,
        O.chain((hasMore) =>
          pipe(
            hasMore,
            O.fromPredicate((r) => r)
          )
        )
      ),
    [hasMore]
  );
  return { fetchMore, first, skip, hasMore: hasMoreMemo };
};
const poolListToArray = F.flow(
  (poolList: PoolsList) => poolList,
  R.collect((k, v) => v),
  A.flatten
);
const foldPools = (poolList: Option<PoolsList>) =>
  pipe(
    poolList,
    O.fold(() => [] as Array<Pools_pools>, poolListToArray)
  );
export const usePools = ({
  chainId,
  fetchPools = defaultFetchPools,
  first = 0,
  more = 1000,
}: UsePools) => {
  const { fetchMore, hasMore } = useFetchMore({
    first,
    skip: 0,
    fetchMore: fetchPools,
  });
  const [pools, setPools] = useState<Option<PoolsList>>(O.none);
  const fetchMoreAndSetPools = useCallback(
    () =>
      pipe(
        F.constant(fetchMore(more)),
        T.map((r) =>
          pipe(
            pools,
            foldPools,
            (pools) => [...r, ...pools],
            groupBySymbol,
            O.some,
            setPools,
            F.constant(r)
          )
        )
      )(),
    [fetchMore]
  );
  useEffect(() => {
    fetchMoreAndSetPools();
  }, [chainId]);
  useEffect(() => {
    pipe(
      hasMore,
      TO.fromOption,
      TO.chain(() => TO.tryCatch(F.flow(fetchMoreAndSetPools)))
    )();
  }, [hasMore]);
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
export const eqPoolTokenToken = (
  a: Pools_pools_token0 | Pools_pools_token1,
  b: Token
) => a.id.toUpperCase() == b.address.toUpperCase();

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
                  (p) =>
                    eqPoolTokenToken(p.token0, t) ||
                    eqPoolTokenToken(p.token1, t)
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
