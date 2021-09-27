import { ApolloClient, InMemoryCache } from '@apollo/client';
import { queryPools, QUERY_POOLS } from '../libs/uniswap-subgraph';
import { task as T } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { Pools } from '../libs/__generated__/Pools';
import 'cross-fetch/polyfill';
import { writeFile } from 'fs/promises';
import path from 'path';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  cache: new InMemoryCache(),
});
async function main() {
  const mockData = pipe(
    () =>
      client.query<Pools>({
        query: QUERY_POOLS,
        variables: { skip: 0, first: 10000 },
      }),
    T.chain((r) =>
      pipe(
        path.resolve(__dirname, '../libs/__mocks__/pools.json'),
        (path) => () => writeFile(path, JSON.stringify(r))
      )
    )
  )();
}

main();
