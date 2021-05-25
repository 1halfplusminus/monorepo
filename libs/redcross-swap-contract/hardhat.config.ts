require('dotenv').config();

import 'hardhat-deploy';
import { GanacheService } from '@nomiclabs/hardhat-ganache/dist/src/ganache-service';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';
import { HardhatUserConfig } from 'hardhat/types';
import * as bip39 from 'bip39';
const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
};

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
};

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
};
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
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      'contracts/NonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/MockTimeNonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/NFTDescriptorTest.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/NonfungibleTokenPositionDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/libraries/NFTDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
    },
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
