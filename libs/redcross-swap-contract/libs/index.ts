import { ERC20__factory } from '../typechain/factories/ERC20__factory';
export { ERC20__factory } from '../typechain/factories/ERC20__factory';
import { providers } from 'ethers';

export const connectERC20 = (p: providers.Web3Provider) => (address: string) =>
  new ERC20__factory().attach(address).connect(p);
