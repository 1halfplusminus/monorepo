import {
  groupBySymbol,
  selectPool,
  selectPools,
  intersectTokenList,
  defaultPools,
} from './uniswap-subgraph';
import { pipe } from 'fp-ts/function';
import { array as A, identity, option as O } from 'fp-ts';
import { QUERY_POOLS_RESULT } from './__mocks__/pools';
import { tokenList } from './__mocks__/index';
import { ap } from 'fp-ts/Apply';

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
  it('should intersect token list and list of pool', () => {
    expect(
      pipe(O.some(pipe(tokenList, A.map(O.some))), intersectTokenList, (i) =>
        i(defaultPools)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [],
      }
    `);
  });
});
