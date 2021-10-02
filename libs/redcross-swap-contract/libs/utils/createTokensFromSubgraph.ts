import { pipe } from 'fp-ts/function';
import { PoolsList } from '../uniswap-subgraph';
import {
  record as R,
  function as F,
  array as A,
  number as N,
  eq as E,
  nonEmptyArray as NEA,
} from 'fp-ts';
import { createTokenFromSubgraph } from '../uniswap';
import { Token } from '@uniswap/sdk-core';

const tokenEq = E.fromEquals((token0: Token, token1: Token) =>
  token0.equals(token1)
);

export const groupTokenBySymbol = (tokens: Token[]) =>
  pipe(
    tokens,
    NEA.groupBy((t) => t.symbol),
    R.map((v) => v[0])
  );
export const createTokensFromSubgraph = (chainId: number) => (
  pools: PoolsList
) =>
  pipe(
    pools,
    R.toArray,
    A.map(([key, p]) =>
      pipe(
        p,
        A.map((p) => [
          createTokenFromSubgraph(chainId)(p.token0),
          createTokenFromSubgraph(chainId)(p.token1),
        ]),
        A.flatten
      )
    ),
    A.flatten,
    A.uniq(tokenEq)
  );
