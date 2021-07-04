import { MapTokenValue, UseTokenValue, useTokenValues } from './useTokenValue';
import { BigNumberish } from 'ethers';
import { Token } from '../types';
import { useCallback } from 'react';
import type { Option } from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { array as A, option as O, taskOption as TO, task as T } from 'fp-ts';
export interface UseFiatPriceProps {
  fiatSymbol: string;
  priceByToken?: MapTokenValue;
  fetchPrice: (token: Token, fiatSymbol: string) => Promise<BigNumberish>;
}

export type UseFiatPrice = (
  props: UseFiatPriceProps
) => {
  getPrice: UseTokenValue['lookup'];
  fetch: (tokens: Option<Token>[]) => void;
};
const fetchPrices = (fetchPrice: (token: Token) => Promise<BigNumberish>) =>
  flow(
    A.map((token: Option<Token>) =>
      pipe(
        token,
        O.map((t) => TO.fromTask(() => fetchPrice(t))),
        O.fold(
          () => TO.none,
          (v) => v
        )
      )
    )
  );
export const useFiatPrice: UseFiatPrice = ({
  priceByToken = O.some(new Map()),
  fetchPrice,
  fiatSymbol,
}) => {
  const { lookup, modifyAts, values } = useTokenValues({
    valueByToken: priceByToken,
  });

  const fetchPriceCallback = useCallback(
    (tokens: Option<Token>[]) =>
      pipe(
        tokens,
        fetchPrices((token) => fetchPrice(token, fiatSymbol)),
        T.sequenceArray,
        T.map((results) => modifyAts(tokens, [...results]))
      )(),
    [fetchPrice, values, fiatSymbol]
  );
  return { fetch: fetchPriceCallback, getPrice: lookup };
};
