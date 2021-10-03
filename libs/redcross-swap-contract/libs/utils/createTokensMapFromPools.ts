import { defaultPools, groupBySymbol, PoolsList } from '../uniswap-subgraph';
import { createPoolsFromSubgraph } from './createPoolsFromSubgraph';
import { pipe } from 'fp-ts/function';
import {
  createTokensFromSubgraph,
  groupTokenBySymbol,
} from './createTokensFromSubgraph';

export const createTokensMapFromPools = (chaindId: number = 1) => (
  pools: PoolsList
) => pipe(pools, createTokensFromSubgraph(chaindId), groupTokenBySymbol);
