import { option as O, array as A } from 'fp-ts';
import { selectPoolByToken } from '../uniswap-subgraph';
import { pipe } from 'fp-ts/function';
import { Pools_pools } from '../__generated__/Pools';
import { TokenListItem } from '../index';
import type { NonEmptyArray } from 'fp-ts/NonEmptyArray';

export const selectFirstPool = (t1: TokenListItem, t2: TokenListItem) => (
  pools: Record<string, NonEmptyArray<Pools_pools>>
) =>
  pipe(
    selectPoolByToken(t1, t2)(pools),
    O.map((r) => A.head(r)),
    O.flatten
  );
