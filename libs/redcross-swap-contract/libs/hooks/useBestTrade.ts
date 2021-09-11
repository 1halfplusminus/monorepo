import { SupportedChainId } from '../constants/chains';
import type { Option } from 'fp-ts/Option';
import { option as O, array as A } from 'fp-ts';
import { Currency, CurrencyAmount } from '@uniswap/sdk-core';

const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
  [SupportedChainId.OPTIMISM]: 6_000_000,
  [SupportedChainId.OPTIMISTIC_KOVAN]: 6_000_000,
};

const DEFAULT_GAS_QUOTE = 2_000_000;
interface UseBestV3TradeExactIn {
  amountIn: Option<CurrencyAmount<Currency>>;
  currencyOut: Option<CurrencyAmount<Currency>>;
  chainId: Option<number>;
}

export const useBestV3TradeExactIn = ({
  amountIn,
  currencyOut,
  chainId,
}: UseBestV3TradeExactIn) => {};
