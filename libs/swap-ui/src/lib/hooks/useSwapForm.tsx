import { task, taskOption as TO, option as O, either as E } from 'fp-ts';
import type { Option } from 'fp-ts/Option';
import { Token } from '../types';
import {
  TokenList,
  UseSearch,
  useSearch,
  useSelectToken,
  UseToken,
  UseTokenProps,
} from './tokenList';
import { MapTokenValue, useTokenValues, getOrElse } from './useTokenValue';
import { some } from 'fp-ts/Option';
import { useEffect, useCallback } from 'react';
import { pipe, flow } from 'fp-ts/function';
import type { Task } from 'fp-ts/Task';
import { BigNumberish } from 'ethers';
import { useFetchRate, UseFetchRateProps } from './useFetchRate';
import { zero } from 'fp-ts/TaskOption';
import { useInversable } from './useInversable';
import { useModal } from '../popup/hooks';
import { useState } from 'react';
import {
  emptySwapInformation,
  SwapInformation,
  useSwapInformation,
} from './useFetchSwapInformation';
import { calculeAmountOption, inverseRate } from '../core/rate';

export type UseSwapFormProps = {
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
  fetchRate: UseFetchRateProps['fetchRate'];
  onSwap: (
    tokenA: Token,
    tokenB: Token,
    swapInformation: SwapInformation,
    confirmSwap: () => Promise<void>,
    cancelSwap: () => Promise<void>
  ) => Promise<Option<string>>;
  slippageTolerance: number;
  fetchSwapInformation: (
    tokenA: Token,
    tokenB: Token
  ) => Promise<Omit<SwapInformation, 'slippageTolerance'>>;
  swapping?: boolean;
} & UseToken &
  Pick<UseSearch, 'search'>;
interface UseSwapProps {
  swapping: boolean;
  tokenA: Option<Token>;
  tokenB: Option<Token>;
  swapInformation: SwapInformation;
  swap: UseSwapFormProps['onSwap'];
  onSwapEnd: (transactionId: string) => Promise<void>;
  onConfirmSwap: () => Promise<void>;
  onCancelSwap: () => Promise<void>;
}
const useSwap = ({
  swapping,
  tokenA,
  tokenB,
  swapInformation,
  swap,
  onSwapEnd,
  onConfirmSwap,
  onCancelSwap,
}: UseSwapProps) => {
  const [isSwapping, setIsSwapping] = useState(() => swapping);
  const handleSwap = useCallback(
    () =>
      pipe(
        tokenA,
        O.chain((first) =>
          pipe(
            tokenB,
            O.chain((last) =>
              pipe(
                swapInformation,
                O.fromPredicate(
                  (swapInformation) => swapInformation !== emptySwapInformation
                ),
                O.map((swapInformation) =>
                  flow(
                    () => setIsSwapping(true),
                    () =>
                      swap(
                        first,
                        last,
                        { ...swapInformation },
                        onConfirmSwap,
                        onCancelSwap
                      ),
                    (r) => pipe(setIsSwapping(false), () => r)
                  )
                )
              )
            )
          )
        ),
        TO.fromOption,
        TO.flatten,
        TO.map((r) => pipe(TO.tryCatch(() => onSwapEnd(r)))),
        TO.flatten
      )(),
    [swap, tokenA, tokenB, swapInformation, setIsSwapping, onSwapEnd]
  );
  const bindSwapButton = useCallback(
    () => ({
      onClick: handleSwap,
      disabled: isSwapping,
    }),
    [handleSwap, isSwapping]
  );
  return { isSwapping, setIsSwapping, bindSwapButton };
};
export const useSwapForm = ({
  commonBases,
  amounts = some(new Map()),
  balances: defaultBalances = some(new Map()),
  fetchBalance = task.never,
  account,
  fetchRate = zero(),
  onSwap: swap = task.never,
  fetchSwapInformation = task.never,
  slippageTolerance,
  swapping = false,
  isSelected,
  first,
  last,
  selectAtIndex,
  inverse,
  search,
  tokens: filteredTokenList,
}: UseSwapFormProps) => {
  const [pristine, setPristine] = useState(true);
  const { lookup, modifyAts } = useTokenValues({
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
  const confirmSwapModal = useModal();
  const waitingForConfirmSwapModal = useModal();
  const cancelSwapModal = useModal();
  const confirmedSwapModal = useModal();
  const swapInformation = useSwapInformation({
    tokenA: first,
    tokenB: last,
    fetchSwapInformation,
  });
  const swapButton = useSwap({
    swapping,
    tokenA: first,
    tokenB: last,
    swapInformation: { ...swapInformation, slippageTolerance },
    swap: (...args) => {
      waitingForConfirmSwapModal.showModal();
      return swap(...args);
    },
    onSwapEnd: async (e) => {
      confirmSwapModal.handleCancel();
    },
    onConfirmSwap: async () => {
      waitingForConfirmSwapModal.handleCancel();
      confirmedSwapModal.showModal();
    },
    onCancelSwap: async () => {
      confirmSwapModal.handleCancel();
      waitingForConfirmSwapModal.handleCancel();
      cancelSwapModal.showModal();
    },
  });
  // Fetch balance when token A or token B change
  useEffect(() => {
    pipe(
      task.sequenceSeqArray([
        TO.tryCatch(() => fetchBalance(first, account)),
        TO.tryCatch(() => fetchBalance(last, account)),
      ]),
      task.map(([soldFirst, soldLast]) =>
        soldModifyAts([first, last], [soldFirst, soldLast])
      )
    )();
  }, [first, account, fetchBalance, last]);

  const changePairTokenValue = useCallback(
    (token: Option<Token>, v: Option<BigNumberish>) =>
      pipe(
        rate,
        O.map((rate) =>
          pipe(
            token,
            O.fromPredicate(() => token === first),
            O.fold(
              () =>
                modifyAts([token, first], [v, calculeAmountOption(v, rate)]),
              () =>
                modifyAts(
                  [token, last],
                  [v, calculeAmountOption(v, inverseRate(rate))]
                )
            ),
            () => setPristine(false)
          )
        )
      ),
    [first, last, rate]
  );
  // Fetch pair token amount at launch if not specified based on rate
  useEffect(() => {
    if (!pristine) return;
    changePairTokenValue(first, lookup(first));
  }, [lookup(first), pristine, changePairTokenValue]);
  useEffect(() => {
    if (!pristine) return;
    changePairTokenValue(last, lookup(last));
  }, [lookup(last), changePairTokenValue, pristine]);

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
      changePairTokenValue(token, O.some(v));
    },
    [changePairTokenValue]
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
  const bindConfirmSwap = useCallback(
    () => ({
      ...swapInformation,
      tokenA: bindInput(0)(first),
      tokenB: bindInput(1)(last),
      rate: rate,
      onRateClick: inversePriceDisplay,
    }),
    [first, last, bindInput, rate, swapInformation, inversePriceDisplay]
  );
  const bindTransactionConfirmed = useCallback(
    () => ({
      tokenA: first,
    }),
    [first]
  );
  const bindConfirmModal = useCallback(
    () => ({
      visible: confirmSwapModal.isModalVisible,
      onCancel: confirmSwapModal.handleCancel,
    }),
    [confirmSwapModal]
  );
  const bindCancelModal = useCallback(
    () => ({
      visible: cancelSwapModal.isModalVisible,
      onCancel: cancelSwapModal.handleCancel,
    }),
    [cancelSwapModal]
  );
  const bindConfirmedSwapModal = useCallback(
    () => ({
      visible: confirmedSwapModal.isModalVisible,
      onCancel: confirmedSwapModal.handleCancel,
    }),
    [confirmedSwapModal]
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
      onSwap: () => {
        confirmSwapModal.showModal();
      },
    }),
    [last, first, soldLookup, lookup]
  );
  const bindSwapInformation = useCallback(
    () => ({
      tokenA: bindInput(0)(first),
      tokenB: bindInput(1)(last),
      slippageTolerance: slippageTolerance,
      ...swapInformation,
    }),
    [first, last, swapInformation, slippageTolerance, bindInput]
  );
  const bindWaitingForConfirmation = useCallback(
    () => ({
      tokenA: first,
      tokenB: last,
      valueA: lookup(first),
      valueB: lookup(last),
    }),
    [first, last, lookup]
  );
  const bindWaitingForConfirmationModal = useCallback(
    () => ({
      visible: waitingForConfirmSwapModal.isModalVisible,
      onCancel: waitingForConfirmSwapModal.handleCancel,
    }),
    [waitingForConfirmSwapModal]
  );
  return {
    bindPriceDisplay,
    bindSwapForm,
    bindSubmitButton,
    soldLookup,
    balances,
    bindConfirmSwap,
    bindConfirmModal,
    confirmSwapModal,
    swapInformation,
    bindSwapInformation,
    bindSwapButton: swapButton.bindSwapButton,
    bindWaitingForConfirmation,
    bindWaitingForConfirmationModal,
    bindCancelModal,
    bindConfirmedSwapModal,
    bindTransactionConfirmed,
  };
};
