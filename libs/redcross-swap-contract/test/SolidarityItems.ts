import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, BigNumberish, constants, utils } from 'ethers';
import { ethers } from 'hardhat';
import {
  IERC20,
  INonfungiblePositionManager,
  INonfungibleTokenPositionDescriptor,
  ISwapRouter,
  IUniswapV3Factory,
  SolidatiryItems__factory,
  SolidatiryToken,
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
import { IQuoter } from '../typechain/IQuoter';
import { encodePath } from './shared/paths';
import { Address } from 'hardhat-deploy/dist/types';

describe('An ERC1155 contract for solidarity item', () => {
  let SolidarityItemFactory: SolidatiryItems__factory;
  /*   let solidityItem: SolidatiryItems; */

  let v3CoreFactory: IUniswapV3Factory;
  let router: ISwapRouter;
  let nft: INonfungiblePositionManager;
  let nftTokenDescriptor: INonfungibleTokenPositionDescriptor;
  let tokens: SolidatiryToken[];
  let signers: SignerWithAddress[];
  let quoter: IQuoter;
  let eth: IERC20;
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

    tokens = await testTokensFixture(router);
    const ethFactory = await ethers.getContractFactory('TestERC20');
    eth = (await ethFactory.deploy(constants.MaxUint256.div(2))) as IERC20;
  });
  beforeEach(async () => {
    const [wallet, signerother] = signers;
    // approve & fund wallets
    for (const token of [...tokens, eth]) {
      for (const signer of signers) {
        await token
          .connect(signer)
          .approve(router.address, constants.MaxUint256);
        await token.connect(signer).approve(nft.address, constants.MaxUint256);
        if (token.address != eth.address) {
          eth.connect(signer).approve(token.address, constants.MaxUint256);
        }
      }
    }
  });
  interface Donation {
    id: number;
    amount: BigNumber;
  }
  class SolidatiryERC20Pair {
    private ercIsLower: boolean;
    constructor(private _erc20: IERC20, private _donation: SolidatiryToken) {
      this.ercIsLower =
        _erc20.address.toLowerCase() < _donation.address.toLowerCase();
      console.log('is erc20 lower', this.ercIsLower);
    }
    tokenIn() {
      return this.ercIsLower ? this._erc20 : this._donation;
    }
    tokenOut() {
      return this.ercIsLower ? this._donation : this._erc20;
    }
    donation() {
      return this._donation;
    }
    erc20() {
      return this._erc20;
    }
    mint(erc20Amount: BigNumberish, donationAmount: BigNumberish) {
      return {
        token0: this.tokenIn().address,
        token1: this.tokenOut().address,
        amount0Desired: this.ercIsLower ? erc20Amount : donationAmount,
        amount1Desired: this.ercIsLower ? donationAmount : erc20Amount,
      };
    }
    priceSqrt(
      nbTokenPerDonation: BigNumberish,
      nbDonationPerToken: BigNumberish
    ) {
      return this.ercIsLower
        ? encodePriceSqrt(nbDonationPerToken, nbTokenPerDonation)
        : encodePriceSqrt(nbTokenPerDonation, nbDonationPerToken);
    }
    async quoteDonation(quoter: IQuoter, fee: number, amount: BigNumberish) {
      return await quoter.callStatic.quoteExactOutput(
        encodePath([this.donation().address, this.erc20().address], [fee]),
        amount
      );
    }
    async donate(
      router: ISwapRouter,
      erc20Amount: BigNumberish,
      donationAmount: BigNumberish,
      recipient: Address,
      fee: number
    ) {
      return await router.exactOutput({
        path: encodePath(
          [this.donation().address, this.erc20().address],
          [fee]
        ),
        amountOut: donationAmount,
        amountInMaximum: erc20Amount,
        deadline: +Date.now(),
        recipient: recipient,
      });
    }
    encodePath(fee: number) {
      return encodePath(
        [this.tokenIn().address, this.tokenOut().address],
        [fee]
      );
    }
  }
  it('It should mint correctly', async () => {
    const [admin, donator, poor] = signers;
    const [sardine] = tokens;

    const pair = new SolidatiryERC20Pair(eth, sardine);
    const sardineFullPrice = pair.priceSqrt(
      utils.parseEther('1'),
      utils.parseEther('1532.8467')
    );

    const waitIncreseLiquidity = () =>
      new Promise<BigNumber>((resolve, reject) => {
        ethers.provider.on(
          nft.filters.IncreaseLiquidity(null, null, null, null),
          async (e) => {
            const log = nft.interface.parseLog(e);
            console.log(
              `Amount ${await pair.tokenIn().symbol()} : ` +
                utils.formatEther(log.args['amount0']),
              `Amount ${await pair.tokenOut().symbol()} : ` +
                utils.formatEther(log.args['amount1'])
            );
            const tokenId = log.args['tokenId'];

            resolve(tokenId);
          }
        );
      });
    const give1EthToDonator = async () => {
      await eth.transfer(donator.address, utils.parseEther('2'));
    };
    const checkIfDonatorHaveNoSardine = async () => {
      expect(utils.formatEther(await sardine.balanceOf(donator.address))).to.eq(
        '0.0'
      );
    };
    const checkIfDonatorHaveSardine = async () => {
      expect(await sardine.balanceOf(donator.address)).to.not.eq(0);
    };
    const createDonationPool = async () => {
      await nft.createAndInitializePoolIfNecessary(
        pair.tokenIn().address,
        pair.tokenOut().address,
        FeeAmount.MEDIUM,
        sardineFullPrice
      );
      await addSardineToPool(
        admin,
        utils.parseEther('1'),
        utils.parseEther('1700')
      );
      await waitIncreseLiquidity();
    };
    const addSardineToPool = async (
      signer: SignerWithAddress,
      ethValue: BigNumber,
      quote: BigNumber
    ) => {
      const liquidityParams: Parameters<typeof nft.mint>[0] = {
        ...pair.mint(ethValue, quote),
        fee: FeeAmount.MEDIUM,
        tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        recipient: signer.address,
        amount0Min: 0,
        amount1Min: 0,
        deadline: +Date.now(),
      };
      const transaction = await nft.connect(signer).mint(liquidityParams);
      await transaction.wait();
    };
    const donate = async (signer: SignerWithAddress, donations: Donation[]) => {
      // quote the amount of sardine
      const donation = donations[0];
      const quote = await pair.quoteDonation(
        quoter,
        FeeAmount.MEDIUM,
        donation.amount
      );
      /*     expect(utils.formatEther(quote)).to.eq(1); */
      console.info(
        'If want ' +
          utils.formatEther(donation.amount) +
          ' sardine you will have to give: ' +
          utils.formatEther(quote) +
          ' eth'
      );
      const balanceBeforeDonation = await pair
        .erc20()
        .balanceOf(signer.address);
      await pair.donate(
        router.connect(signer),
        quote,
        donation.amount,
        pair.donation().address,
        FeeAmount.MEDIUM
      );
      /*   await (
        await sardine
          .connect(signer)
          .donate(
            amount.token0,
            amount.token1,
            pair.tokenIn().address,
            pair.tokenOut().address,
            sardine1PSplipageFullPrice,
            FeeAmount.MEDIUM
          )
      ).wait(); */
      /*       expect(await sardine.balanceOf(solidityItem.address)).to.not.eq(0); */
      /* await router.connect(solidityItem.address).exactInputSingle({
        tokenIn: eth.address,
        tokenOut: sardine.address,
        amountIn: quote,
        amountOutMinimum: donation.amount,
        fee: FeeAmount.MEDIUM,
        deadline: +Date.now(),
        sqrtPriceLimitX96: encodePriceSqrt(100, 200),
        recipient: solidityItem.address,
      }); */
      /*       router.connect(solidityItem.address). */
      /* await mintSardine();
      await checkIfDonatorHaveSardine(); */
      /*  await addSardineToPool(donator, ethValue, quote); */
      await checkIfDonatorHaveNoSardine();
      expect(utils.formatEther(await eth.balanceOf(signer.address))).to.eq(
        utils.formatEther(balanceBeforeDonation.sub(quote))
      );
    };
    await give1EthToDonator();
    await checkIfDonatorHaveNoSardine();
    await createDonationPool();
    console.info('Donation pool created');
    await donate(donator, [{ id: 0, amount: utils.parseEther('300') }]);
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
