import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, constants, Signer, Transaction, utils } from 'ethers';
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
  let sardine: IERC20;
  before(async () => {
    signers = await ethers.getSigners();
    const [wallet, donator] = signers;
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
    solidityItem = await SolidarityItemFactory.deploy(
      router.address,
      quoter.address
    );
    await solidityItem.init();
    const erc1155 = ERC1155__factory.connect(solidityItem.address, wallet);
    const cloneAddress = await solidityItem.clone();
    sardine = ERC20__factory.connect(cloneAddress, wallet);
    await erc1155.setApprovalForAll(sardine.address, true);
    await erc1155.connect(donator).setApprovalForAll(sardine.address, true);
    await erc1155.connect(wallet).setApprovalForAll(sardine.address, true);
    tokens = await testTokensFixture([sardine]);
  });
  beforeEach(async () => {
    const [wallet, signerother] = signers;
    // approve & fund wallets
    for (const token of tokens) {
      for (const signer of signers) {
        await token
          .connect(signer)
          .approve(router.address, constants.MaxUint256);
        await token.connect(signer).approve(nft.address, constants.MaxUint256);
        await token
          .connect(signer)
          .approve(solidityItem.address, constants.MaxUint256);
      }
    }
  });
  interface Donation {
    id: number;
    amount: BigNumber;
  }
  it('It should mint correctly', async () => {
    const [admin, donator, poor] = signers;
    const [eth, sardine] = tokens;

    const sardineFullPrice = encodePriceSqrt(1700, 1);
    const sardine1PSplipageFullPrice = encodePriceSqrt(169000, 100);
    const sardineDonationPrice = encodePriceSqrt(70000, 100);
    // calcule the donation without executing it
    const quoteDonation = (signer: Signer, donation: Donation[]) => {};
    const waitIncreseLiquidity = () =>
      new Promise<BigNumber>((resolve, reject) => {
        ethers.provider.on(
          nft.filters.IncreaseLiquidity(null, null, null, null),
          (e) => {
            const log = nft.interface.parseLog(e);
            console.log(
              'Amount0: ' + utils.formatEther(log.args['amount0']),
              'Amount1: ' + utils.formatEther(log.args['amount1'])
            );
            const tokenId = log.args['tokenId'];

            resolve(tokenId);
          }
        );
      });
    const give1EthToDonator = async () => {
      await eth.transfer(donator.address, utils.parseEther('1'));
    };
    const checkIfDonatorHaveNoSardine = async () => {
      expect(await sardine.balanceOf(donator.address)).to.eq(0);
    };
    const checkIfDonatorHaveSardine = async () => {
      expect(await sardine.balanceOf(donator.address)).to.not.eq(0);
    };
    const createDonationPool = async () => {
      await nft.createAndInitializePoolIfNecessary(
        eth.address,
        sardine.address,
        FeeAmount.MEDIUM,
        sardineFullPrice
      );
      await addSardineToPool(admin, BigNumber.from(1), BigNumber.from(1700));
      await waitIncreseLiquidity();
    };
    const mintSardine = async () => {};
    const addSardineToPool = async (
      signer: SignerWithAddress,
      ethValue: BigNumber,
      quote: BigNumber
    ) => {
      await sardine
        .connect(router.address)
        .transferFrom(signer.address, donator.address, quote);
      eth.connect(signer).approve(router.address, ethValue);
      sardine.connect(signer).approve(router.address, quote);
      const liquidityParams: Parameters<typeof nft.mint>[0] = {
        token0: eth.address,
        token1: sardine.address,
        fee: FeeAmount.MEDIUM,
        tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        recipient: signer.address,
        amount0Desired: ethValue,
        amount1Desired: quote,
        amount0Min: 0,
        amount1Min: 0,
        deadline: +Date.now(),
      };
      const transaction = await nft.connect(signer).mint(liquidityParams);
      await transaction.wait();
    };
    const donate = async (signer: Signer, donations: Donation[]) => {
      // quote the amount of sardine
      // const quote = await quoter
      //   .connect(donator)
      //   .callStatic.quoteExactInputSingle(
      //     eth.address,
      //     sardine.address,
      //     FeeAmount.MEDIUM,
      //     ethValue,
      //     encodePriceSqrt(102, 100)
      //   );
      // console.info(
      //   'If you give ' +
      //     utils.formatEther(ethValue) +
      //     ' eth you will have: ' +
      //     utils.formatEther(quote) +
      //     ' sardine'
      // );
      const donation = donations[0];
      const quote = await quoter
        .connect(donator)
        .callStatic.quoteExactOutputSingle(
          eth.address,
          sardine.address,
          FeeAmount.MEDIUM,
          donation.amount,
          encodePriceSqrt(100, 102)
        );
      console.info(
        'If want ' +
          utils.formatEther(donation.amount) +
          ' sardine you will have to give: ' +
          utils.formatEther(quote) +
          ' eth'
      );
      await (
        await solidityItem
          .connect(signer)
          .donate(
            [donation.id],
            [donation.amount],
            quote,
            eth.address,
            encodePriceSqrt(102, 100),
            FeeAmount.MEDIUM
          )
      ).wait();
      expect(await sardine.balanceOf(solidityItem.address)).to.not.eq(0);
      await router.connect(solidityItem.address).exactInputSingle({
        tokenIn: eth.address,
        tokenOut: sardine.address,
        amountIn: quote,
        amountOutMinimum: donation.amount,
        fee: FeeAmount.MEDIUM,
        deadline: +Date.now(),
        sqrtPriceLimitX96: encodePriceSqrt(100, 200),
        recipient: solidityItem.address,
      });
      /*       router.connect(solidityItem.address). */
      /* await mintSardine();
      await checkIfDonatorHaveSardine(); */
      /*  await addSardineToPool(donator, ethValue, quote); */
      await checkIfDonatorHaveNoSardine();
    };
    await give1EthToDonator();
    await checkIfDonatorHaveNoSardine();
    await createDonationPool();
    console.info('Donation pool created');
    await donate(donator, [{ id: 0, amount: utils.parseEther('1') }]);
    // mint sardine with eth
    // await expect(
    //   nft.createAndInitializePoolIfNecessary(
    //     tokens[0].address,
    //     tokens[1].address,
    //     FeeAmount.MEDIUM,
    //     encodePriceSqrt(1364, 1)
    //   )
    // ).to.not.reverted;
    // const liquidityParams: Parameters<typeof nft.mint>[0] = {
    //   token0: tokens[0].address,
    //   token1: tokens[1].address,
    //   fee: FeeAmount.MEDIUM,
    //   tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    //   tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    //   recipient: wallet.address,
    //   amount0Desired: utils.parseEther('1'),
    //   amount1Desired: utils.parseEther('1').mul(1705),
    //   amount0Min: 0,
    //   amount1Min: 0,
    //   deadline: +Date.now(),
    // };
    // const waitIncreseLiquidity = () =>
    //   new Promise<BigNumber>((resolve, reject) => {
    //     ethers.provider.on(
    //       nft.filters.IncreaseLiquidity(null, null, null, null),
    //       (e) => {
    //         const log = nft.interface.parseLog(e);
    //         console.log(
    //           utils.formatEther(log.args['amount0']),
    //           utils.formatEther(log.args['amount1'])
    //         );
    //         const tokenId = log.args['tokenId'];

    //         resolve(tokenId);
    //       }
    //     );
    //   });
    // const waitTokenId = waitIncreseLiquidity();
    // const transaction = await nft.mint(liquidityParams);
    // await transaction.wait();
    // const tokenId = await waitTokenId;
    // const owner = await nft.ownerOf(tokenId);
    // console.log(owner === wallet.address);
    // console.log(
    //   'Balance before : ' +
    //     (await tokens[1].balanceOf(donator.address)).toString()
    // );
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
    // const quote = await quoter.callStatic.quoteExactInputSingle(
    //   tokens[0].address,
    //   tokens[1].address,
    //   FeeAmount.MEDIUM,
    //   utils.parseEther('0.1'),
    //   encodePriceSqrt(99, 100)
    // );
    // console.log(utils.formatEther(quote));
    // Create un metadata file on ipfs
    // Pin the metadata
    // Create the token in blockchain
    // Set the metadata url
  });
});
