import type { Option } from 'fp-ts/Option';
import { Token } from '../types';
import { TokenList, useSearch, useSelectToken } from './tokenList';
import {
  MapTokenValue,
  useTokenValues,
  getOrElse,
  lookupOption,
} from './useTokenValue';
import { some } from 'fp-ts/Option';
import { useEffect, useCallback } from 'react';
import * as options from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

export interface UseSwapFormProps {
  fetchBalance: (
    token: Option<Token>,
    account: Option<string>
  ) => Promise<string>;
  tokens: TokenList;
  commonBases: TokenList;
  selected: TokenList;
  amounts?: MapTokenValue;
  balances?: MapTokenValue;
  account: Option<string>;
}
export const useSwapForm = ({
  tokens,
  selected,
  commonBases,
  amounts = some(new Map()),
  balances: defaultBalances = some(new Map()),
  fetchBalance,
  account,
}: UseSwapFormProps) => {
  const { filteredTokenList, search } = useSearch(tokens);
  const { isSelected, first, last, selectAtIndex, inverse } = useSelectToken({
    commonlyUsed: commonBases,
    tokens: filteredTokenList,
    selected: selected,
  });
  const { lookup, modifyAt } = useTokenValues({
    valueByToken: amounts,
  });
  const {
    modifyAt: soldModifyAt,
    lookup: soldLookup,
    values: balances,
  } = useTokenValues({
    valueByToken: defaultBalances,
  });
  useEffect(() => {
    fetchBalance(first, account).then((r) => {
      soldModifyAt(first, r);
    });
  }, [first, account, fetchBalance]);
  useEffect(() => {
    fetchBalance(last, account).then((r) => {
      soldModifyAt(last, r);
    });
  }, [last, account, fetchBalance]);
  /*  useEffect(() => {
    fetchBalance(first, account).then((r) => {
      console.log(first, r);
      soldModifyAt(first, r);
    });
  }, [first, account, fetchBalance, soldModifyAt]);
  useEffect(() => {
    fetchBalance(last, account).then((r) => {
      soldModifyAt(last, '100');
    });
  }, [last, account, soldModifyAt, fetchBalance]); */
  const onSelected = useCallback(
    (index: 0 | 1) => (token: Token) => {
      selectAtIndex(token, index);
      pipe(some(token), (token) =>
        fetchBalance(token, account).then((r) => {
          soldModifyAt(token, r);
        })
      );
    },
    [soldModifyAt, fetchBalance, account, selectAtIndex]
  );
  const onValueChange = useCallback(
    (token: Option<Token>, v: string) => {
      modifyAt(token, v);
    },
    [modifyAt]
  );
  const bindInput = useCallback(
    (index: 0 | 1) => (token: Option<Token>) => ({
      isSelected,
      selected: token,
      onSelected: onSelected(index),
      value: getOrElse(lookup(token)),
      onValueChange,
      sold: soldLookup(token),
    }),
    [onValueChange, isSelected, lookup, onSelected, soldLookup]
  );
  const bindSwapForm = useCallback(
    () => ({
      tokens: filteredTokenList,
      onSearch: search,
      onInverse: inverse,
      inputA: bindInput(0)(first),
      inputB: bindInput(1)(last),
      commonBases,
    }),
    [first, last, filteredTokenList, search, inverse, commonBases]
  );
  const bindSubmitButton = useCallback(
    () => ({
      tokenA: some({
        token: first,
        sold: soldLookup(first),
        amount: lookup(first),
      }),
      tokenB: some({
        token: last,
        sold: soldLookup(last),
        amount: lookup(last),
      }),
    }),
    [last, first, soldLookup, lookup]
  );
  return {
    bindSwapForm,
    bindSubmitButton,
    soldLookup,
    balances,
  };
};
