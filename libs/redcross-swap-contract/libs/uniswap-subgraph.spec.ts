import {
  groupBySymbol,
  selectPool,
  selectPools,
  intersectTokenList,
  defaultPools,
  UsePools,
} from './uniswap-subgraph';
import { pipe } from 'fp-ts/function';
import { array as A, option as O, record as R } from 'fp-ts';
import { QUERY_POOLS_RESULT } from './__mocks__/pools';
import { tokenList } from './__mocks__/index';
import { ap } from 'fp-ts/Apply';
import { usePools } from './uniswap-subgraph';
import { renderHook } from '@testing-library/react-hooks';

describe('Uniswap subgrap', () => {
  it('should group pool correctly', () => {
    const result = pipe(QUERY_POOLS_RESULT, selectPools, groupBySymbol);
    pipe(
      pipe(result, selectPool('WETH', 'DOGGE')),
      O.map((pools) => pipe(pools, A.head)),
      O.flatten,
      O.map((p) =>
        expect(p.id).toEqual('0x000f0c0b0b791e855dcc5ad6501c7529dea882e0')
      )
    );
    pipe(
      pipe(result, selectPool('DOGGE', 'WETH')),
      O.map((pools) => pipe(pools, A.head)),
      O.flatten,
      O.map((p) =>
        expect(p.id).toEqual('0x000f0c0b0b791e855dcc5ad6501c7529dea882e0')
      )
    );
  });
  it('should intersect token list and list of pool', () => {
    expect(
      pipe(O.some(pipe(tokenList, A.map(O.some))), intersectTokenList, (i) =>
        i(defaultPools)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
              "name": "Aave",
              "symbol": "AAVE",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xfF20817765cB7f73d4bde2e66e067E58D11095C2",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397",
              "name": "Amp",
              "symbol": "AMP",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xba100000625a3754423978a60c9317c58a424e3D",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
              "name": "Balancer",
              "symbol": "BAL",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://assets.coingecko.com/coins/images/9545/thumb/band-protocol.png?1568730326",
              "name": "Band Protocol",
              "symbol": "BAND",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png",
              "name": "Bancor Network Token",
              "symbol": "BNT",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xc00e94Cb662C3520282E6f5717214004A7f26888",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png",
              "name": "Compound",
              "symbol": "COMP",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xD533a949740bb3306d119CC777fa900bA034cd52",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
              "name": "Curve DAO Token",
              "symbol": "CRV",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x6810e776880C02933D47DB1b9fc05908e5386b96",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6810e776880C02933D47DB1b9fc05908e5386b96/logo.png",
              "name": "Gnosis Token",
              "symbol": "GNO",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566",
              "name": "The Graph",
              "symbol": "GRT",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://assets.coingecko.com/coins/images/3373/thumb/IuNzUb5b_400x400.jpg?1589526336",
              "name": "Keep Network",
              "symbol": "KEEP",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdd974D5C2e2928deA5F71b9825b8b646686BD200/logo.png",
              "name": "Kyber Network Crystal",
              "symbol": "KNC",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
              "name": "ChainLink Token",
              "symbol": "LINK",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD/logo.png",
              "name": "LoopringCoin V2",
              "symbol": "LRC",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745",
              "name": "Decentraland",
              "symbol": "MANA",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png",
              "name": "Maker",
              "symbol": "MKR",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x4fE83213D56308330EC302a8BD641f1d0113A4Cc",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://assets.coingecko.com/coins/images/3318/thumb/photo1198982838879365035.jpg?1547037916",
              "name": "NuCypher",
              "symbol": "NU",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4575f41308EC1483f3d399aa9a2826d74Da13Deb/logo.png",
              "name": "Orchid",
              "symbol": "OXT",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x408e41876cCCDC0F92210600ef50372656052a38",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x408e41876cCCDC0F92210600ef50372656052a38/logo.png",
              "name": "Republic Token",
              "symbol": "REN",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x221657776846890989a759BA2973e427DfF5C9bB",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x221657776846890989a759BA2973e427DfF5C9bB/logo.png",
              "name": "Reputation Augur v2",
              "symbol": "REPv2",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png",
              "name": "Synthetix Network Token",
              "symbol": "SNX",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png",
              "name": "UMA Voting Token v1",
              "symbol": "UMA",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
              "name": "Uniswap",
              "symbol": "UNI",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
              "name": "USDCoin",
              "symbol": "USDC",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
              "name": "Tether USD",
              "symbol": "USDT",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330",
              "name": "yearn finance",
              "symbol": "YFI",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
              "chainId": 1,
              "decimals": 18,
              "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png",
              "name": "0x Protocol Token",
              "symbol": "ZRX",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              "chainId": 3,
              "decimals": 18,
              "logoURI": "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
              "name": "Uniswap",
              "symbol": "UNI",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              "chainId": 4,
              "decimals": 18,
              "logoURI": "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
              "name": "Uniswap",
              "symbol": "UNI",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              "chainId": 5,
              "decimals": 18,
              "logoURI": "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
              "name": "Uniswap",
              "symbol": "UNI",
            },
          },
          Object {
            "_tag": "Some",
            "value": Object {
              "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
              "chainId": 42,
              "decimals": 18,
              "logoURI": "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
              "name": "Uniswap",
              "symbol": "UNI",
            },
          },
        ],
      }
    `);
  });
  const usePoolsProps: UsePools = {
    chainId: O.some(1),
    fetchPools: async () => defaultPools,
  };
  it('should use pools correctly', async () => {
    const { result: usePoolsResult, waitForValueToChange } = renderHook(() =>
      usePools(usePoolsProps)
    );
    await waitForValueToChange(() => usePoolsResult.current.pools);
    expect(O.isSome(usePoolsResult.current.pools)).toBe(true);
    if (O.isSome(usePoolsResult.current.pools)) {
      expect(pipe(usePoolsResult.current.pools.value, R.isEmpty)).toBeFalsy();
    }
  });
});
