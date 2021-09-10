import { renderHook } from '@testing-library/react-hooks';
import {
  UseAllCurrencyCombinations,
  useAllCurrencyCombinations,
} from './useAllCurrencyCombinations';

import { pipe } from 'fp-ts/function';
import { record as R, option as O } from 'fp-ts';
import { getMockTokens } from '../utils/getMockTokens';
import { mapTokenListItemToToken } from '../index';
import { createUniswapToken } from '../uniswap';

describe('Use All Currecny Combinations', () => {
  const tokens = getMockTokens();
  const tokenA = pipe(tokens, R.lookup('WETH'), O.map(createUniswapToken));
  const tokenB = pipe(tokens, R.lookup('DAI'), O.map(createUniswapToken));
  const useAllCurrencyCombinationsProps: UseAllCurrencyCombinations = {
    tokenA: tokenA,
    tokenB: tokenB,
    chainId: O.some(1),
  };
  it('should combine all currency for a pair', () => {
    const { result } = renderHook(() =>
      useAllCurrencyCombinations({ ...useAllCurrencyCombinationsProps })
    );
    expect(O.isSome(result.current)).toBe(true);
    expect(pipe(result.current)).toMatchInlineSnapshot(`
      Object {
        "_tag": "Some",
        "value": Array [
          Array [
            Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
            Token {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
          ],
          Array [
            Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
            Token {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "USD//C",
              "symbol": "USDC",
            },
          ],
          Array [
            Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
            Token {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "Tether USD",
              "symbol": "USDT",
            },
          ],
          Array [
            Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
            Token {
              "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "chainId": 1,
              "decimals": 8,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped BTC",
              "symbol": "WBTC",
            },
          ],
          Array [
            Token {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
            Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
          ],
          Array [
            Token {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
            Token {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "USD//C",
              "symbol": "USDC",
            },
          ],
          Array [
            Token {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
            Token {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "Tether USD",
              "symbol": "USDT",
            },
          ],
          Array [
            Token {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
            Token {
              "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "chainId": 1,
              "decimals": 8,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped BTC",
              "symbol": "WBTC",
            },
          ],
          Array [
            Token {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "USD//C",
              "symbol": "USDC",
            },
            Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
          ],
          Array [
            Token {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "USD//C",
              "symbol": "USDC",
            },
            Token {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
          ],
          Array [
            Token {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "USD//C",
              "symbol": "USDC",
            },
            Token {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "Tether USD",
              "symbol": "USDT",
            },
          ],
          Array [
            Token {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "USD//C",
              "symbol": "USDC",
            },
            Token {
              "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "chainId": 1,
              "decimals": 8,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped BTC",
              "symbol": "WBTC",
            },
          ],
          Array [
            Token {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "Tether USD",
              "symbol": "USDT",
            },
            Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
          ],
          Array [
            Token {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "Tether USD",
              "symbol": "USDT",
            },
            Token {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
          ],
          Array [
            Token {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "Tether USD",
              "symbol": "USDT",
            },
            Token {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "USD//C",
              "symbol": "USDC",
            },
          ],
          Array [
            Token {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "Tether USD",
              "symbol": "USDT",
            },
            Token {
              "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "chainId": 1,
              "decimals": 8,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped BTC",
              "symbol": "WBTC",
            },
          ],
          Array [
            Token {
              "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "chainId": 1,
              "decimals": 8,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped BTC",
              "symbol": "WBTC",
            },
            Token {
              "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped Ether",
              "symbol": "WETH",
            },
          ],
          Array [
            Token {
              "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "chainId": 1,
              "decimals": 8,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped BTC",
              "symbol": "WBTC",
            },
            Token {
              "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              "chainId": 1,
              "decimals": 18,
              "isNative": false,
              "isToken": true,
              "name": "Dai Stablecoin",
              "symbol": "DAI",
            },
          ],
          Array [
            Token {
              "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "chainId": 1,
              "decimals": 8,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped BTC",
              "symbol": "WBTC",
            },
            Token {
              "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "USD//C",
              "symbol": "USDC",
            },
          ],
          Array [
            Token {
              "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "chainId": 1,
              "decimals": 8,
              "isNative": false,
              "isToken": true,
              "name": "Wrapped BTC",
              "symbol": "WBTC",
            },
            Token {
              "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "chainId": 1,
              "decimals": 6,
              "isNative": false,
              "isToken": true,
              "name": "Tether USD",
              "symbol": "USDT",
            },
          ],
        ],
      }
    `);
  });
});
