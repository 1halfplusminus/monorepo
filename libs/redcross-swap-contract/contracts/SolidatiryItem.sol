// contracts/GameItems.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract SolidatiryItems is ERC1155 {
    uint256 public constant SARDINE = 0;
    uint256 public constant CLOTH = 1;
    uint256 public constant POO = 2;

    constructor(string memory nodeAddress) ERC1155(nodeAddress) {}
}
