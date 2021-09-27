import { Pools_pools } from '../__generated__/Pools';
import { pipe } from 'fp-ts/function';
import { PoolsList } from '../uniswap-subgraph';
import {
  array as A,
  record as R,
  option as O,
  taskOption as TO,
  function as F,
  task as T,
  number as N,
} from 'fp-ts';
import { createPoolContract } from '../uniswap';
import { Provider } from '@ethersproject/providers';
import { sequenceT } from 'fp-ts/Apply';
import { useEffect, useMemo } from 'react';
interface UsePoolsContract {
  pools: O.Option<PoolsList>;
  provider: O.Option<Provider>;
}
export const usePoolsContract = ({ pools, provider }: UsePoolsContract) => {
  const contracts = useMemo(
    () =>
      pipe(
        sequenceT(O.Apply)(pools, provider),
        O.map(([pools, provider]) =>
          pipe(
            pools,
            R.collect((k, v) => v),
            A.flatten,
            A.map((p) => [p, createPoolContract(provider)(p.id)] as const)
          )
        )
      ),
    [pools]
  );
};
