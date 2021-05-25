//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.6;

contract Box {
    uint256 _value;

    function store(uint256 value) external {
        _value = value;
    }

    function getValue() public view returns (uint256) {
        return _value;
    }
}
