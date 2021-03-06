/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { DelegateERC20 } from "../DelegateERC20";

export class DelegateERC20__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    erc1115: string,
    token: BigNumberish,
    overrides?: Overrides
  ): Promise<DelegateERC20> {
    return super.deploy(
      erc1115,
      token,
      overrides || {}
    ) as Promise<DelegateERC20>;
  }
  getDeployTransaction(
    erc1115: string,
    token: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(erc1115, token, overrides || {});
  }
  attach(address: string): DelegateERC20 {
    return super.attach(address) as DelegateERC20;
  }
  connect(signer: Signer): DelegateERC20__factory {
    return super.connect(signer) as DelegateERC20__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DelegateERC20 {
    return new Contract(address, _abi, signerOrProvider) as DelegateERC20;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "erc1115",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "token",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610b86380380610b8683398101604081905261002f91610058565b600080546001600160a01b0319166001600160a01b039390931692909217909155600155610090565b6000806040838503121561006a578182fd5b82516001600160a01b0381168114610080578283fd5b6020939093015192949293505050565b610ae78061009f6000396000f3fe608060405234801561001057600080fd5b50600436106100725760003560e01c806370a082311161005057806370a08231146100c8578063a9059cbb146100db578063dd62ed3e146100ee57610072565b8063095ea7b31461007757806318160ddd146100a057806323b872dd146100b5575b600080fd5b61008a610085366004610977565b610101565b6040516100979190610a33565b60405180910390f35b6100a86101d0565b6040516100979190610a3e565b61008a6100c336600461093c565b6101d5565b6100a86100d63660046108f0565b6102ab565b61008a6100e9366004610977565b610382565b6100a86100fc36600461090a565b6103b9565b600080546040516101c69173ffffffffffffffffffffffffffffffffffffffff16906101349086906001906024016109e5565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152918152602080830180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa22cb46500000000000000000000000000000000000000000000000000000000179052815160608101909252602380835290610ab8908301396103c1565b5060019392505050565b600090565b6000805460015460405161029e9273ffffffffffffffffffffffffffffffffffffffff169161020c918891889188906024016109a0565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152918152602080830180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff242432a00000000000000000000000000000000000000000000000000000000179052815160608101909252602380835290610ab890830139610508565b50600190505b9392505050565b6000805460015460405161037a926103759273ffffffffffffffffffffffffffffffffffffffff909116916102e4918791602401610a0d565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152918152602080830180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167efdd58e00000000000000000000000000000000000000000000000000000000179052815160608101909252602380835290610ab89083013961051f565b610647565b90505b919050565b600080546001546040516101c69273ffffffffffffffffffffffffffffffffffffffff169161020c913391889188906024016109a0565b600092915050565b60606103cc8461064e565b610421576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526026815260200180610a6e6026913960400191505060405180910390fd5b6000808573ffffffffffffffffffffffffffffffffffffffff16856040518082805190602001908083835b6020831061048957805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0909201916020918201910161044c565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d80600081146104e9576040519150601f19603f3d011682016040523d82523d6000602084013e6104ee565b606091505b50915091506104fe828286610654565b9695505050505050565b60606105178484600085610712565b949350505050565b606061052a8461064e565b61057f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526024815260200180610a946024913960400191505060405180910390fd5b6000808573ffffffffffffffffffffffffffffffffffffffff16856040518082805190602001908083835b602083106105e757805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920191602091820191016105aa565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855afa9150503d80600081146104e9576040519150601f19603f3d011682016040523d82523d6000602084013e6104ee565b6020015190565b3b151590565b606083156106635750816102a4565b8251156106735782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b838110156106d75781810151838201526020016106bf565b50505050905090810190601f1680156107045780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b60608247101561076d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526026815260200180610a486026913960400191505060405180910390fd5b6107768561064e565b6107e157604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040518082805190602001908083835b6020831061084a57805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0909201916020918201910161080d565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146108ac576040519150601f19603f3d011682016040523d82523d6000602084013e6108b1565b606091505b50915091506108c1828286610654565b979650505050505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461037d57600080fd5b600060208284031215610901578081fd5b6102a4826108cc565b6000806040838503121561091c578081fd5b610925836108cc565b9150610933602084016108cc565b90509250929050565b600080600060608486031215610950578081fd5b610959846108cc565b9250610967602085016108cc565b9150604084013590509250925092565b60008060408385031215610989578182fd5b610992836108cc565b946020939093013593505050565b73ffffffffffffffffffffffffffffffffffffffff94851681529290931660208301526040820152606081019190915260a06080820181905260009082015260c00190565b73ffffffffffffffffffffffffffffffffffffffff9290921682521515602082015260400190565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b901515815260200190565b9081526020019056fe416464726573733a20696e73756666696369656e742062616c616e636520666f722063616c6c416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6e7472616374416464726573733a207374617469632063616c6c20746f206e6f6e2d636f6e747261637444656c656761746545524332303a2066756e6374696f6e2063616c6c206661696c6564a164736f6c6343000706000a";
