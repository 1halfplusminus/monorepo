import { task, taskOption as TO, either as E } from 'fp-ts';
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
      task.sequenceArray([
        TO.fromTask(() => fetchBalance(first, account)),
        TO.fromTask(() => fetchBalance(last, account)),
      ]),
      task.map(([amount1, amount2]) =>
        pipe(
          [
            pipe(
              amount1,
              E.fromOption(() => false)
            ),
            pipe(
              amount2,
              E.fromOption(() => false)
            ),
          ],
          ([soldFirst, soldLast]) => {
            if (E.isRight(soldFirst) && E.isRight(soldLast)) {
              soldModifyAts([first, last], [soldFirst.right, soldLast.right]);
            }
            if (E.isRight(soldFirst) && E.isLeft(soldLast)) {
              soldModifyAt(first, soldFirst.right);
            }
            if (E.isRight(soldLast) && E.isLeft(soldFirst)) {
              soldModifyAt(last, soldLast.right);
            }
          }
        )
      )
    )();
    /* fetchBalance(first, account).then((r) => {
      fetchBalance(last, account)
        .then((rLast) => {
          soldModifyAts([first, last], [r, rLast]);
        })
        .catch(() => soldModifyAt(first, r));
    }); */
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
