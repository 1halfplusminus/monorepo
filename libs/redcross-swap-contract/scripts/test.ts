import all from 'it-all';
import uint8ArrayConcat from 'uint8arrays/concat';
import uint8ArrayToString from 'uint8arrays/to-string';
import uint8ArrayFromString from 'uint8arrays/from-string';
import { create as createHttpClient, globSource } from 'ipfs-http-client';
import config from 'config';
import { join } from 'path';
async function createIpfsClient() {
  const client = createHttpClient(config.get('ipfs.node'));
  return client;
}
const getAssetFilePath = (id: string) => {
  return join(__dirname, '../assets', id);
};

async function main() {
  /*   const node = await create({});
  const version = await node.version();
  console.log('Version:', version.version); */
  const httpClient = await createIpfsClient();
  const files = httpClient.addAll([getAssetFilePath('0.json')]);
  for await (const file of files) {
    console.log('Added file:', file.path, file.cid.toString());
    const data = uint8ArrayConcat(await all(httpClient.cat(file.cid)));
    console.log('Added file contents:', uint8ArrayToString(data));
  }

  //   console.log('Added file contents:', uint8ArrayToString(data));
  // const files = httpClient.addAll(globSource('../assets', { recursive: true }));
  // for await (const file of files) {
  //   const data = uint8ArrayConcat(await all(httpClient.cat(file.cid)));
  //   console.log('Added file contents:', uint8ArrayToString(data));
  // }
}

main();
