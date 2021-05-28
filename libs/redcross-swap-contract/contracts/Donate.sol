// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.6;

import './IDonatable.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import 'hardhat/console.sol';
pragma abicoder v2;

contract Donate is IDonatable {
    ISwapRouter private immutable _router;

    constructor(ISwapRouter router) {
        _router = router;
    }

    function getTokenInTokenOut(address a, address b) external returns (bool) {
        return a > b;
    }

    function donate(
        uint256 amountIn,
        uint256 amountOut,
        address tokenIn,
        address tokenOut,
        uint160 priceLimit,
        uint24 fee
    ) external override {
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                amountIn: amountIn,
                amountOutMinimum: amountOut,
                fee: fee,
                deadline: block.timestamp + 1000000000,
                sqrtPriceLimitX96: priceLimit,
                recipient: address(this)
            });
        IERC20(tokenOut).approve(address(_router), amountOut);
        IERC20(tokenIn).approve(address(_router), amountIn);
        console.log('Try to transfer amount in: ', amountIn);
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        /*
        mint in the before token transfer if needed         
        _mint(address(this), tokenOut, amount, ''); 
        */
        Address.functionCall(
            address(_router),
            abi.encodeWithSignature(
                'exactInputSingle(ExactInputSingleParams calldata params)',
                params
            ),
            'DONATION - ROUTER ERROR'
        );
    }
}
