import { create as createHttpClient } from 'ipfs-http-client';
import config from 'config';
import { join } from 'path';
import { readFileSync } from 'fs';

export async function createIpfsClient() {
  const client = createHttpClient(config.get('ipfs.node'));
  return client;
}
export const getAssetFilePath = (id: string) => {
  return join(__dirname, '../assets', id);
};

export const getAsset = (id: string) => ({
  content: readFileSync(getAssetFilePath(id)),
  path: id,
});
