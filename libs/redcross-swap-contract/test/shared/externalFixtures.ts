import {
  abi as FACTORY_ABI,
  bytecode as FACTORY_BYTECODE,
} from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json';
import type {} from '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { IUniswapV3Factory } from '../../typechain/IUniswapV3Factory';
import { Contract, Signer } from 'ethers/lib/ethers';
import WETH9 from '../contracts/WETH9.json';
import {
  INonfungiblePositionManager,
  INonfungiblePositionManager__factory,
  ISwapRouter,
  IWETH9,
  TestERC20,
} from '../../typechain';
import {
  abi as SWAP_ROUTER_ABI,
  bytecode as SWAP_ROUTER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json';
import {
  abi as NFT_POSITION_MANAGER_ABI,
  bytecode as NFT_POSITION_MANAGER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';
import {
  abi as NFT_POSITION_DESCRITOR_ABI,
  bytecode as NFT_POSITION_DESCRITOR_BYTECODE,
  linkReferences,
} from './../contracts/NonfungibleTokenPositionDescriptor.json';
import { INonfungibleTokenPositionDescriptor } from '../../typechain/INonfungibleTokenPositionDescriptor';
import { constants } from 'ethers';
import { linkLibraries } from './linkLibraries';
import NFTDescriptor from '@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json';

export const wethFixture = async (signer: Signer) =>
  (await new ethers.ContractFactory(
    WETH9.abi,
    WETH9.bytecode,
    signer
  ).deploy()) as IWETH9;

export const v3CoreFactoryFixture = async (signer: Signer) =>
  (await new ethers.ContractFactory(
    FACTORY_ABI,
    FACTORY_BYTECODE,
    signer
  ).deploy()) as IUniswapV3Factory;

export const v3RouterFixture = async (
  signer: Signer,
  factory: IUniswapV3Factory,
  weth9: IWETH9
) => {
  const router = (await new ethers.ContractFactory(
    SWAP_ROUTER_ABI,
    SWAP_ROUTER_BYTECODE,
    signer
  ).deploy(factory.address, weth9.address)) as ISwapRouter;
  return router;
};

type NFTDescriptorLibrary = any;
const nftDescriptorLibraryFixture = async (signer: Signer) => {
  return (await new ethers.ContractFactory(
    NFTDescriptor.abi,
    NFTDescriptor.bytecode,
    signer
  ).deploy()) as Contract;
};

export const nftTokenDescriptorFixture = async (
  signer: Signer,
  weth9: IWETH9
) => {
  const nftDescriptorLibrary = await nftDescriptorLibraryFixture(signer);
  const linkedBytecode = linkLibraries(
    { bytecode: NFT_POSITION_DESCRITOR_BYTECODE, linkReferences },
    {
      NFTDescriptor: nftDescriptorLibrary.address,
    }
  );
  const nftTokenDescriptor = (await new ethers.ContractFactory(
    NFT_POSITION_DESCRITOR_ABI,
    linkedBytecode,
    signer
  ).deploy(weth9.address)) as INonfungibleTokenPositionDescriptor;
  return nftTokenDescriptor;
};

export const nftPositionManagerFixture = async (
  signer: Signer,
  factory: IUniswapV3Factory,
  weth9: IWETH9,
  tokenDescriptor: INonfungibleTokenPositionDescriptor
) => {
  const nftPositionManager = (await new ethers.ContractFactory(
    NFT_POSITION_MANAGER_ABI,
    NFT_POSITION_MANAGER_BYTECODE,
    signer
  ).deploy(
    factory.address,
    weth9.address,
    tokenDescriptor.address
  )) as INonfungiblePositionManager;
  INonfungiblePositionManager__factory;
  return nftPositionManager;
};

export const testTokensFixture = async () => {
  const tokenFactory = await ethers.getContractFactory('TestERC20');
  const tokens = (await Promise.all([
    tokenFactory.deploy(constants.MaxUint256.div(2)), // do not use maxu256 to avoid overflowing
    tokenFactory.deploy(constants.MaxUint256.div(2)),
    tokenFactory.deploy(constants.MaxUint256.div(2)),
  ])) as [TestERC20, TestERC20, TestERC20];
  return tokens.sort((a, b) =>
    a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1
  );
};
