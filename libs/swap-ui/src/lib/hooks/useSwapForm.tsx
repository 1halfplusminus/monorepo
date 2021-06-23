import type { Option } from 'fp-ts/Option';
import { Token, WalletProvider } from '../types';
import { TokenList, useSearch, useSelectToken } from './tokenList';
import { MapTokenValue, useTokenValues, getOrElse } from './useTokenValue';
import { some } from 'fp-ts/Option';
import { useEffect } from 'react';
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
  balances = some(new Map()),
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
  const sold = useTokenValues({
    valueByToken: balances,
  });
  useEffect(() => {
    fetchBalance(first, account).then((r) => {
      sold.modifyAt(first, r);
    });
  }, [first, account]);
  useEffect(() => {
    console.log(last);
    fetchBalance(last, account).then((r) => {
      sold.modifyAt(last, r);
    });
  }, [last, account]);
  const onSelected = (index: 0 | 1) => (token: Token) => {
    selectAtIndex(token, index);
    pipe(some(token), (token) =>
      fetchBalance(token, account).then((r) => {
        sold.modifyAt(token, r);
      })
    );
  };
  const onValueChange = (token: Option<Token>, v: string) => {
    modifyAt(token, v);
  };
  const bindInput = (index: 0 | 1) => (token: Option<Token>) => ({
    isSelected,
    selected: token,
    onSelected: onSelected(index),
    value: getOrElse(lookup(token)),
    onValueChange,
    sold: sold.lookup(token),
  });
  const bindSwapForm = () => ({
    tokens: filteredTokenList,
    onSearch: search,
    onInverse: inverse,
    inputA: bindInput(0)(first),
    inputB: bindInput(1)(last),
  });
  const bindSubmitButton = () => ({
    tokenA: some({
      token: first,
      sold: sold.lookup(first),
      amount: lookup(first),
    }),
    tokenB: some({
      token: last,
      sold: sold.lookup(last),
      amount: lookup(last),
    }),
  });
  return {
    bindSwapForm,
    bindSubmitButton,
  };
};
