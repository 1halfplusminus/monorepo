// contracts/GameItems.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.6;
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract SolidatiryItems is ERC1155 {
    constructor() ERC1155('ipfs://{id}') {}
}
