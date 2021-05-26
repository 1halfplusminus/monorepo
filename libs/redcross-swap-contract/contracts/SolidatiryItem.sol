// contracts/GameItems.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.6;
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/proxy/UpgradeableBeacon.sol';
import '@openzeppelin/contracts/proxy/BeaconProxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import 'hardhat/console.sol';

contract DelegateERC20 is IERC20 {
    address _erc1115;
    uint256 _token;

    constructor(address erc1115, uint256 token) {
        _erc1115 = erc1115;
        _token = token;
    }

    function totalSupply() external view override returns (uint256) {}

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account)
        external
        view
        override
        returns (uint256)
    {
        return
            toUint256(
                Address.functionStaticCall(
                    _erc1115,
                    abi.encodeWithSignature(
                        'balanceOf(address,uint256)',
                        account,
                        _token
                    ),
                    'DelegateERC20: function call failed'
                )
            );
    }

    function transfer(address recipient, uint256 amount)
        external
        override
        returns (bool)
    {
        Address.functionCall(
            _erc1115,
            abi.encodeWithSignature(
                'safeTransferFrom(address,address,uint256,uint256,bytes)',
                msg.sender,
                recipient,
                _token,
                amount,
                ''
            ),
            'DelegateERC20: function call failed'
        );
        return true;
    }

    function allowance(address owner, address spender)
        external
        view
        override
        returns (uint256)
    {
        return 0;
    }

    function approve(address spender, uint256 amount)
        external
        override
        returns (bool)
    {
        Address.functionDelegateCall(
            _erc1115,
            abi.encodeWithSignature(
                'setApprovalForAll(address,bool)',
                spender,
                true
            ),
            'DelegateERC20: function call failed'
        );
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        Address.functionDelegateCall(
            _erc1115,
            abi.encodeWithSignature(
                'safeTransferFrom(address,address,uint256,uint256,bytes)',
                sender,
                recipient,
                _token,
                amount,
                ''
            ),
            'DelegateERC20: function call failed'
        );
        return true;
    }

    function toUint256(bytes memory _bytes)
        internal
        pure
        returns (uint256 value)
    {
        assembly {
            value := mload(add(_bytes, 0x20))
        }
    }
}

contract SolidatiryItems is ERC1155 {
    uint256 public constant SARDINE = 0;
    DelegateERC20 public clone;
    mapping(address => uint256) clones;

    constructor() ERC1155('ipfs://{id}') {
        _mint(msg.sender, SARDINE, 10000000000000000000000000 * 10**18, '');
        clone = new DelegateERC20(address(this), SARDINE);
    }

    function init() external {
        console.log('Me ', address(this));
        console.log('Clone ', address(clone));
    }
}
