import all from 'it-all';
import uint8ArrayConcat from 'uint8arrays/concat';
import uint8ArrayToString from 'uint8arrays/to-string';
import { getAsset, createIpfsClient } from '../libs/ipfs';

async function main() {
  const httpClient = await createIpfsClient();
  const files = httpClient.addAll([getAsset('0.json')]);
  for await (const file of files) {
    console.log('Added file:', file.path, file.cid.toString());
    const data = uint8ArrayConcat(await all(httpClient.cat(file.cid)));
    console.log('Added file contents:', uint8ArrayToString(data));
  }
}

main();
