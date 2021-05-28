// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.6;

interface IDonatable {
    function donate(
        uint256 amountIn,
        uint256 amountOut,
        address tokenIn,
        address tokenOut,
        uint160 priceLimit,
        uint24 fee
    ) external;
}
