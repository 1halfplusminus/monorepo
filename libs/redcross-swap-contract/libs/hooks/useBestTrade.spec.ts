import { useBestV3TradeExactIn } from './useBestTrade';
import { pipe } from 'fp-ts/function';
import { defaultPools, groupBySymbol } from '../uniswap-subgraph';
import { option as O, record as R } from 'fp-ts';
import { getMockTokens } from '../utils/getMockTokens';
import { createUniswapToken, useQuoter } from '../uniswap';
import { createPoolsFromSubgraph } from '../utils/createPoolsFromSubgraph';
import { signer } from '../__mocks__/providers';
import { renderHook } from '@testing-library/react-hooks';

import fetch from 'node-fetch';
(global as any).fetch = fetch as any;
jest.setTimeout(100000);
describe('Use Best Trade', () => {
  const pools = O.some(groupBySymbol(defaultPools));
  const tokens = getMockTokens();
  const tokenA = pipe(tokens, R.lookup('WETH'));
  const tokenB = pipe(tokens, R.lookup('DAI'));
  const tokenC = pipe(tokens, R.lookup('LRC'));
  const chainId = 1;
  it('should use best trade', async () => {
    const { result, waitForValueToChange } = renderHook(() => {
      const quoter = useQuoter({
        provider: O.some(signer),
        chainId: O.some(chainId),
      });
      return [
        useBestV3TradeExactIn({
          tokenIn: pipe(O.some(createUniswapToken), O.ap(tokenA)),
          tokenOut: pipe(O.some(createUniswapToken), O.ap(tokenC)),
          amountIn: O.some(chainId),
          chainId: O.some(chainId),
          pools: pipe(
            pools,
            O.map((pools) => createPoolsFromSubgraph(1)(pools))
          ),
          quoter,
        }),
        quoter,
      ] as const;
    });

    expect(O.isSome(result.current[1])).toBe(true);
    /*     expect(O.isSome(result.current[0].quotesResults)).toBe(true); */
    await waitForValueToChange(() => result.current[0].routes, {
      timeout: 10000,
    });
    expect(O.isSome(result.current[0].bestRoute)).toBe(true);
  });
});
