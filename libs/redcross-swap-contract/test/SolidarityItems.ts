import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, constants, Transaction, utils } from 'ethers';
import { ethers } from 'hardhat';
import {
  ERC1155__factory,
  ERC20__factory,
  IERC20,
  INonfungiblePositionManager,
  INonfungibleTokenPositionDescriptor,
  ISwapRouter,
  IUniswapV3Factory,
  SolidatiryItems,
  SolidatiryItems__factory,
  TestERC20,
} from '../typechain';
import { IUniswapV3Pool__factory } from '../typechain/factories/IUniswapV3Pool__factory';
import { FeeAmount, TICK_SPACINGS } from './shared/constants';
import { encodePriceSqrt } from './shared/encodePriceSqrt';
import { expandTo18Decimals } from './shared/expandTo18Decimals';
import {
  nftTokenDescriptorFixture,
  v3CoreFactoryFixture,
  v3RouterFixture,
  wethFixture,
  nftPositionManagerFixture,
  testTokensFixture,
  quoterFixture,
} from './shared/externalFixtures';
import { getMaxTick, getMinTick } from './shared/ticks';
import bn from 'bignumber.js';
import { IQuoter } from '../typechain/IQuoter';

describe('An ERC1155 contract for solidarity item', () => {
  let SolidarityItemFactory: SolidatiryItems__factory;
  let solidityItem: SolidatiryItems;
  let metaUrl = 'ipfs://';
  let v3CoreFactory: IUniswapV3Factory;
  let router: ISwapRouter;
  let nft: INonfungiblePositionManager;
  let nftTokenDescriptor: INonfungibleTokenPositionDescriptor;
  let tokens: IERC20[];
  let signers: SignerWithAddress[];
  let quoter: IQuoter;
  before(async () => {
    signers = await ethers.getSigners();
    const [wallet, other] = signers;
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
    quoter = await quoterFixture(wallet, v3CoreFactory, weth);
    // MY ITEMS
    SolidarityItemFactory = (await ethers.getContractFactory(
      'SolidatiryItems'
    )) as SolidatiryItems__factory;
    const deploy = await SolidarityItemFactory.deploy();
    await deploy.init();
    const erc1155 = ERC1155__factory.connect(deploy.address, wallet);
    const cloneAddress = await deploy.clone();
    const clone = ERC20__factory.connect(cloneAddress, wallet);
    console.log(
      'Balance from clone',
      (await clone.balanceOf(wallet.address)).toString()
    );
    const balance = await erc1155.balanceOf(wallet.address, 0);
    console.log('Balance of', balance.toString());
    await erc1155.setApprovalForAll(clone.address, true);
    console.log(
      'Balance after transfer from clone',
      (await clone.balanceOf(wallet.address)).toString()
    );
    tokens = await testTokensFixture([clone]);
  });
  beforeEach(async () => {
    const [wallet, other] = signers;
    // approve & fund wallets
    for (const token of tokens) {
      await token.approve(nft.address, constants.MaxUint256);
      await token.connect(other).approve(nft.address, constants.MaxUint256);
      await token.connect(other).approve(router.address, constants.MaxUint256);
      await token.transfer(other.address, expandTo18Decimals(1_000_000));
    }
    // Deploy metadata ?
    /*     solidityItem = await SolidarityItemFactory.deploy(); */
  });

  it('It should mint correctly', async () => {
    const [wallet, other] = signers;
    await expect(
      nft.createAndInitializePoolIfNecessary(
        tokens[0].address,
        tokens[1].address,
        FeeAmount.MEDIUM,
        encodePriceSqrt(1364, 1)
      )
    ).to.not.reverted;
    const liquidityParams: Parameters<typeof nft.mint>[0] = {
      token0: tokens[0].address,
      token1: tokens[1].address,
      fee: FeeAmount.MEDIUM,
      tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      recipient: wallet.address,
      amount0Desired: utils.parseEther('1'),
      amount1Desired: utils.parseEther('1').mul(1705),
      amount0Min: 0,
      amount1Min: 0,
      deadline: +Date.now(),
    };
    const waitIncreseLiquidity = () =>
      new Promise<BigNumber>((resolve, reject) => {
        ethers.provider.on(
          nft.filters.IncreaseLiquidity(null, null, null, null),
          (e) => {
            const log = nft.interface.parseLog(e);
            console.log(
              utils.formatEther(log.args['amount0']),
              utils.formatEther(log.args['amount1'])
            );
            const tokenId = log.args['tokenId'];

            resolve(tokenId);
          }
        );
      });
    const waitTokenId = waitIncreseLiquidity();
    const transaction = await nft.mint(liquidityParams);
    await transaction.wait();
    const tokenId = await waitTokenId;
    const owner = await nft.ownerOf(tokenId);
    console.log(owner === wallet.address);
    console.log(
      'Balance before : ' +
        (await tokens[1].balanceOf(other.address)).toString()
    );
    /*    const result = await router.connect(other).exactInputSingle({
      tokenIn: tokens[0].address,
      tokenOut: tokens[1].address,
      amountIn: 50,
      amountOutMinimum: 100,
      fee: FeeAmount.MEDIUM,
      deadline: +Date.now(),
      sqrtPriceLimitX96: encodePriceSqrt(100, 200),
      recipient: other.address,
    });
    await result.wait(); */

    /*   console.log(
      'Balance after : ' + (await tokens[1].balanceOf(other.address)).toString()
    ); */
    /*   const pool = await v3CoreFactory.getPool(
      tokens[0].address,
      tokens[1].address,
      FeeAmount.MEDIUM
    ); */
    const quote = await quoter.callStatic.quoteExactInputSingle(
      tokens[0].address,
      tokens[1].address,
      FeeAmount.MEDIUM,
      utils.parseEther('0.1'),
      encodePriceSqrt(99, 100)
    );
    console.log(utils.formatEther(quote));
    // Create un metadata file on ipfs
    // Pin the metadata
    // Create the token in blockchain
    // Set the metadata url
  });
});
