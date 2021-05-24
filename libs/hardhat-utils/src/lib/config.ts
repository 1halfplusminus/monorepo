import { IConfig } from 'config';
import { network } from 'hardhat';

let _configCache: IConfig = null;

export const loadConfig = async () => {
  process.env.NODE_ENV = network.name;
  if (!_configCache) {
    _configCache = await import('config').then(
      (c: IConfig | { default: IConfig }) => {
        return 'default' in c ? c.default : c;
      }
    );
  }
  return _configCache;
};
