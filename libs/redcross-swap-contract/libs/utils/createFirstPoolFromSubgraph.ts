import { getMockTokens } from '../utils/getMockTokens';
import { option as O, record as R, function as F, array as A } from 'fp-ts';
import { defaultPools, groupBySymbol } from '../uniswap-subgraph';

import { createPoolFromSubgrap } from '../uniswap';
import { Pools_pools } from '../__generated__/Pools';
import { TokenListItem } from '../index';
import type { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { selectFirstPool } from '../utils/selectFirstPool';

export const createFirstPoolFromSubgrap = (
  tokenA: TokenListItem,
  tokenB: TokenListItem
) =>
  F.flow(
    (pools: Record<string, NonEmptyArray<Pools_pools>>) =>
      selectFirstPool(tokenA, tokenB)(pools),
    O.map((p) => createPoolFromSubgrap(1)(p, 1, []))
  );
