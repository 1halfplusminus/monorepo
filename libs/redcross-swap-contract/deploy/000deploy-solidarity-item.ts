import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { Box__factory, SolidatiryItems__factory } from '../typechain';
import { deployOrAttach } from '@halfoneplusminus/hardhat-utils';
import { loadConfig } from '@halfoneplusminus/hardhat-utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const config = await loadConfig();
  const box = await deployOrAttach(SolidatiryItems__factory, [config.get('')]);
  console.log('Box deployed at: ', box.address);
};
export default func;
