import { ContractFactory, Signer } from 'ethers';
import type {} from '@nomiclabs/hardhat-ethers';
import type {} from 'hardhat-deploy';
import { artifacts, ethers, deployments } from 'hardhat';
import { loadConfig } from './config';

const getName = async <T extends ContractFactory>(
  t: new () => T
): Promise<string> => {
  const config = await loadConfig();
  const name = t.name.replace('__factory', '');
  const mockKey = `mocks.${name}`;
  if (config.has(mockKey)) {
    console.log('use mock for ', name, config.get(mockKey));
    return config.get(mockKey);
  }
  return name;
};
export const deployOrAttach = async <T extends ContractFactory>(
  t: new () => T,
  args: Parameters<T['deploy']>,
  signer?: string
): Promise<ReturnType<T['deploy']>> => {
  const name = await getName(t);
  const { deploy } = deployments;
  const config = await loadConfig();
  const configKey = `contracts.${name}`;
  const factory = (await ethers.getContractFactory(name)) as T;
  if (config.has(configKey)) {
    const configAddress = config.get<string>(configKey);
    return factory.attach(configAddress);
  }
  const deployResult = await deploy(name, {
    args: args.filter((arg) => arg != null),
    from: signer ? signer : await ethers.provider.getSigner().getAddress(),
  });
  const signerWithAddress = await ethers.getSigner(signer);
  return ethers.getContractAt(name, deployResult.address, signerWithAddress);
};

export const getContrat = async <T extends ContractFactory>(
  t: new () => T,
  signer?: Signer | string
): Promise<ReturnType<T['deploy']>> => {
  const name = await getName(t);
  const deployment = await deployments.getOrNull(name);
  if ((await artifacts.artifactExists(name)) && deployment) {
    return ethers.getContractAt(
      name,
      deployment.address,
      typeof signer === 'string' ? await ethers.getSigner(signer) : signer
    );
  }

  const config = await loadConfig();
  const configKey = `contracts.${name}`;
  if (config.has(configKey)) {
    const configAddress = config.get<string>(configKey);
    const factory = (await ethers.getContractFactory(name)) as T;
    return factory.attach(configAddress);
  }
  throw new Error(`cannot find contract for ${name}`);
};
