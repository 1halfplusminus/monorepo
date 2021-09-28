import { ApolloClient, InMemoryCache, ApolloQueryResult } from '@apollo/client';
import { QUERY_POOLS } from '../libs/uniswap-subgraph';
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
  let allData: ApolloQueryResult<Pools> | null;
  let lastResult: ApolloQueryResult<Pools> | null;
  let skip = 0;
  let first = 1000;
  do {
    console.log('skip: ' + skip + ' first: ' + first);
    lastResult = await pipe(() =>
      client.query<Pools>({
        query: QUERY_POOLS,
        variables: { skip: skip, first: first },
      })
    )();
    skip += first;
    if (!allData) {
      allData = lastResult;
    } else {
      allData.data = {
        pools: [...allData?.data?.pools, ...lastResult.data.pools],
      };
    }
  } while (lastResult.data.pools.length > 0);
  await pipe(path.resolve(__dirname, '../libs/__mocks__/pools.json'), (path) =>
    writeFile(path, JSON.stringify(allData))
  );
}

main();
