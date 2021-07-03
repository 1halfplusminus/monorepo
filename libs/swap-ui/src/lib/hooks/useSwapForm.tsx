import { task, taskOption as TO, option as O, either as E } from 'fp-ts';
import type { Option } from 'fp-ts/Option';
import { Token } from '../types';
import { TokenList, useSearch, useSelectToken } from './tokenList';
import { MapTokenValue, useTokenValues, getOrElse } from './useTokenValue';
import { some } from 'fp-ts/Option';
import { useEffect, useCallback } from 'react';
import { pipe } from 'fp-ts/function';
import type { Task } from 'fp-ts/Task';
import { BigNumberish } from 'ethers';
import { useFetchRate } from './useFetchRate';
import { zero } from 'fp-ts/TaskOption';
import { useInversable } from './useInversable';
import * as options from 'fp-ts/Option';
import * as arrays from 'fp-ts/Array';
import * as option from 'fp-ts/Option';
import * as either from 'fp-ts/Either';
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
  fetchRate: Task<Option<BigNumberish>>;
}
export const useSwapForm = ({
  tokens,
  selected,
  commonBases,
  amounts = some(new Map()),
  balances: defaultBalances = some(new Map()),
  fetchBalance,
  account,
  fetchRate = zero(),
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
    modifyAts: soldModifyAts,
  } = useTokenValues({
    valueByToken: defaultBalances,
  });

  const { rate } = useFetchRate({
    tokenA: first,
    tokenB: last,
    fetchRate: fetchRate,
  });

  const { inversed, inverse: inversePriceDisplay } = useInversable({
    inversed: false,
  });
  useEffect(() => {
    pipe(
      task.sequenceSeqArray([
        TO.fromTask(() => fetchBalance(first, account)),
        TO.fromTask(() => fetchBalance(last, account)),
      ]),
      task.map((result) => {
        pipe(
          result,
          ([soldFirst, soldLast]) =>
            O.isSome(soldLast) && O.isSome(soldFirst)
              ? E.right([soldFirst.value, soldLast.value])
              : E.left([soldFirst, soldLast]),
          E.map(([soldFirst, soldLast]) => {
            soldModifyAts([first, last], [soldFirst, soldLast]);
            return [soldFirst, soldLast];
          }),
          E.mapLeft(([soldFirst, soldLast]) =>
            pipe(
              [soldFirst, soldLast],
              ([soldFirst, soldLast]) =>
                O.isSome(soldLast)
                  ? E.right(soldLast.value)
                  : E.left(soldFirst),
              E.map((soldLast) => {
                soldModifyAt(last, soldLast);
              }),
              E.mapLeft((soldFirst) => {
                pipe(
                  soldFirst,
                  option.map((soldFirst) => {
                    soldModifyAt(first, soldFirst);
                  })
                );
              })
            )
          )
        );
      })
    )();
  }, [first, account, fetchBalance, last]);

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
    [first, last, filteredTokenList, search, inverse, commonBases, bindInput]
  );
  const bindPriceDisplay = useCallback(
    () => ({
      tokenA: first,
      tokenB: last,
      rate: rate,
      inversed,
      onClick: inversePriceDisplay,
    }),
    [first, last, rate, inversed, inversePriceDisplay]
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
    bindPriceDisplay,
    bindSwapForm,
    bindSubmitButton,
    soldLookup,
    balances,
  };
};
