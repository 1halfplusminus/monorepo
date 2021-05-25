import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { constants } from 'ethers';
import { ethers } from 'hardhat';
import {
  INonfungiblePositionManager,
  INonfungibleTokenPositionDescriptor,
  ISwapRouter,
  IUniswapV3Factory,
  SolidatiryItems,
  SolidatiryItems__factory,
  TestERC20,
} from '../typechain';
import { FeeAmount } from './shared/constants';
import { encodePriceSqrt } from './shared/encodePriceSqrt';
import { expandTo18Decimals } from './shared/expandTo18Decimals';
import {
  nftTokenDescriptorFixture,
  v3CoreFactoryFixture,
  v3RouterFixture,
  wethFixture,
  nftPositionManagerFixture,
  testTokensFixture,
} from './shared/externalFixtures';

describe('An ERC1155 contract for solidarity item', () => {
  let SolidarityItemFactory: SolidatiryItems__factory;
  let solidityItem: SolidatiryItems;
  let metaUrl = 'ipfs://';
  let v3CoreFactory: IUniswapV3Factory;
  let router: ISwapRouter;
  let nft: INonfungiblePositionManager;
  let nftTokenDescriptor: INonfungibleTokenPositionDescriptor;
  let tokens: TestERC20[];
  let signers: SignerWithAddress[];

  before(async () => {
    signers = await ethers.getSigners();
    const [wallet] = signers;
    const weth = await wethFixture(wallet);
    v3CoreFactory = await v3CoreFactoryFixture(wallet);
    router = await v3RouterFixture(wallet, v3CoreFactory, weth);
    nftTokenDescriptor = await nftTokenDescriptorFixture(wallet, weth);
    nft = await nftPositionManagerFixture(
      wallet,
      v3CoreFactory,
      weth,
      nftTokenDescriptor
    );
    tokens = await testTokensFixture();
    SolidarityItemFactory = (await ethers.getContractFactory(
      'SolidatiryItems'
    )) as SolidatiryItems__factory;
  });
  beforeEach(async () => {
    const [wallet, other] = signers;
    // approve & fund wallets
    for (const token of tokens) {
      await token.approve(nft.address, constants.MaxUint256);
      await token.connect(other).approve(nft.address, constants.MaxUint256);
      await token.transfer(other.address, expandTo18Decimals(1_000_000));
    }
    // Deploy metadata ?
    /*     solidityItem = await SolidarityItemFactory.deploy(); */
  });

  it('It should mint correctly', async () => {
    await expect(
      nft.createAndInitializePoolIfNecessary(
        tokens[0].address,
        tokens[1].address,
        FeeAmount.MEDIUM,
        encodePriceSqrt(1, 1)
      )
    ).to.not.reverted;
    router.exactInput(params);
    console.log('here');
    // Create un metadata file on ipfs
    // Pin the metadata
    // Create the token in blockchain
    // Set the metadata url
  });
});
