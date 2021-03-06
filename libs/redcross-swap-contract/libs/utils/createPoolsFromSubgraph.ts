import { Tick } from '@uniswap/v3-sdk';
import { record as R, function as F, array as A, number as N } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { createPoolFromSubgrap } from '../uniswap';
import { PoolsList } from '../uniswap-subgraph';
import { contramap } from 'fp-ts/Ord';
import { Pools_pools_ticks, Pools_pools } from '../__generated__/Pools';
import { TICK_SPACINGS } from '../../test/shared/constants';

export const sortTickByIndex = pipe(
  N.Ord,
  contramap((t: Tick) => t.index)
);
export const createTicksFromSubGrap = (t: Pools_pools_ticks) => {
  return new Tick({
    liquidityGross: t.liquidityGross,
    liquidityNet: t.liquidityNet,
    index: Number(t.id.split('#')[1]),
  });
};

export const createPoolFromSubgraph = (chainId: number) => (p: Pools_pools) =>
  pipe(
    createPoolFromSubgrap(chainId)(
      p,
      TICK_SPACINGS[p.feeTier],
      pipe(p.ticks, A.map(createTicksFromSubGrap), A.sort(sortTickByIndex))
    )
  );
export const createPoolsFromSubgraph = (chainId: number) => (
  pools: PoolsList
) =>
  pipe(
    pools,
    R.toArray,
    A.map(([key, p]) =>
      pipe(
        p,
        A.map((p) =>
          createPoolFromSubgrap(chainId)(
            p,
            TICK_SPACINGS[p.feeTier],
            pipe(
              p.ticks,
              A.map(createTicksFromSubGrap),
              A.sort(sortTickByIndex)
            )
          )
        )
      )
    ),
    A.flatten
    /*     A.compact */
  );
