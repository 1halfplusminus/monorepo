const result = require('dotenv').config();

import { ethers } from 'ethers';
import { SupportedChainId } from '../constants/chains';

const rinkeby = {
  url: process.env.RINKEBY_URL,
  blockGasLimit: 9500000,
  accounts: {
    mnemonic: process.env.RINKEBY_MNEMONIC,
  },
};

export const chainId = SupportedChainId.RINKEBY;
const _provider = new ethers.providers.JsonRpcProvider(rinkeby.url, chainId);
/* let wallet = ethers.Wallet.fromMnemonic(rinkeby.accounts.mnemonic); */
export const provider = _provider;
export const signer = provider.getSigner();
