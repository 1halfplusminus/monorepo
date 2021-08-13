import { groupBySymbol, selectPool, selectPools } from './uniswap-subgraph';
import { QUERY_POOLS_RESULT } from './__mocks__/tokens';
import { pipe } from 'fp-ts/function';
import { array as A, option as O } from 'fp-ts';

describe('Uniswap subgrap', () => {
  it('should group pool correctly', () => {
    const result = pipe(QUERY_POOLS_RESULT, selectPools, groupBySymbol);
    pipe(
      pipe(result, selectPool('WETH', 'DOGGE')),
      O.map((pools) => pipe(pools, A.head)),
      O.flatten,
      O.map((p) =>
        expect(p.id).toEqual('0x000f0c0b0b791e855dcc5ad6501c7529dea882e0')
      )
    );
    pipe(
      pipe(result, selectPool('DOGGE', 'WETH')),
      O.map((pools) => pipe(pools, A.head)),
      O.flatten,
      O.map((p) =>
        expect(p.id).toEqual('0x000f0c0b0b791e855dcc5ad6501c7529dea882e0')
      )
    );
  });
});
