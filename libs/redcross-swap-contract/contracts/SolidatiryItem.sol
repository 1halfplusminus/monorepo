// contracts/GameItems.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.6;
import '@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol';
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/proxy/UpgradeableBeacon.sol';
import '@openzeppelin/contracts/proxy/BeaconProxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
pragma abicoder v2;

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
        Address.functionCall(
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

contract SolidatiryItems is ERC1155, IERC1155Receiver {
    uint256 public constant SARDINE = 0;
    DelegateERC20 public clone;
    IQuoter immutable _quoter;
    ISwapRouter immutable _router;
    mapping(uint256 => address) tokenToClone;

    constructor(ISwapRouter router, IQuoter quoter) ERC1155('ipfs://{id}') {
        _mint(msg.sender, SARDINE, 1000000 * 10**18, '');
        clone = new DelegateERC20(address(this), SARDINE);
        tokenToClone[SARDINE] = address(clone);
        _quoter = quoter;
        _router = router;
    }

    function init() external {
        console.log('Me ', address(this));
        console.log('Clone ', address(clone));
    }

    function donate(
        uint256[] calldata tokens,
        uint128[] calldata amounts,
        uint256 amountIn,
        address tokenIn,
        uint128 priceLimit,
        uint24 fee
    ) external {
        for (uint256 index = 0; index < tokens.length; index++) {
            uint256 token = tokens[index];
            uint128 amount = amounts[index];
            address erc20Address = tokenToClone[token];
            ISwapRouter.ExactInputSingleParams memory params =
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: tokenIn,
                    tokenOut: erc20Address,
                    amountIn: amountIn,
                    amountOutMinimum: amount,
                    fee: fee,
                    deadline: block.timestamp + 1000000000,
                    sqrtPriceLimitX96: priceLimit,
                    recipient: address(this)
                });
            IERC20(erc20Address).approve(address(_router), amount);
            IERC20(tokenIn).approve(address(_router), amountIn);
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
            _mint(address(this), token, amount, '');
            /*    Address.functionCall(
                address(_router),
                abi.encodeWithSignature(
                    'exactInputSingle(ExactInputSingleParams calldata params)',
                    params
                ),
                'ROUTER ERROR'
            ); */
        }
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {}

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return
            bytes4(
                keccak256(
                    'onERC1155Received(address,address,uint256,uint256,bytes)'
                )
            );
    }
}
