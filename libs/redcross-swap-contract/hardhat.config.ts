require('dotenv').config();

import 'hardhat-deploy';
import { GanacheService } from '@nomiclabs/hardhat-ganache/dist/src/ganache-service';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';
import { HardhatUserConfig } from 'hardhat/types';
import * as bip39 from 'bip39';

const mnemonic = process.env.MNEMONIC || bip39.generateMnemonic();

const accounts = {
  mnemonic,
};

const {
  gasPrice,
  accounts: __,
  ...ganacheOptions
} = GanacheService.getDefaultOptions();

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      {
        version: '0.6.2',
        settings: {},
      },
      {
        version: '0.6.6',
        settings: {},
      },
      { version: '0.4.11', settings: {} },
      { version: '0.4.24', settings: {} },
    ],
  },
  networks: {
    hardhat: {
      /*    forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL,
      }, */
      accounts,
    },
    ganache: {
      ...ganacheOptions,
      blockGasLimit: 6000000000,
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic:
          'helmet before isolate library correct goddess place extend tone custom okay dish',
      },
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      /*   forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL,
      }, */
      accounts,
    } /* ,
    kovan: {
      url: process.env.KOVAN_RPC_URL,
      chainId: 42, // kovan's id
      gasMultiplier: 10,
      timeout: 200000, // # of blocks before a deployment times out  (minimum/default: 50)
      accounts,
      blockGasLimit: 9500000,
    },
    rinkeby: {
      url:process.env.RINKEBY_RPC_URL,
      blockGasLimit: 9500000,
      accounts,
    }, */,
  },
};
export default config;
