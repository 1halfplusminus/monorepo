// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import './Donate.sol';

contract SolidatiryToken is ERC20, ERC20Burnable, Pausable, Ownable, Donate {
    constructor(
        string memory name_,
        string memory symbol_,
        ISwapRouter router
    ) Donate(router) ERC20(name_, symbol_) {
        /*        _mint(msg.sender, 10000 * 10**decimals()); */
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
        if (from != address(0)) {
            _mint(from, amount);
        }
    }
}
