import { Token } from '../types';
import { BigNumberish } from 'ethers';
import { Option } from 'fp-ts/Option';
import * as map from 'fp-ts/Map';
import { useState, useCallback } from 'react';
import { pipe, flow } from 'fp-ts/function';
import * as options from 'fp-ts/Option';
import { eqToken, TokenList } from './tokenList';
import * as taskEither from 'fp-ts/TaskEither';
import * as arrays from 'fp-ts/Array';

export type MapTokenValue = Option<Map<Token, BigNumberish>>;

export type UseTokenValue = {
  lookup(token: Option<Token>): Option<BigNumberish>;
  modifyAt(token: Option<Token>, value: BigNumberish): void;
  modifyAts(tokens: Option<Token>[], values: Option<BigNumberish>[]): void;
  values: MapTokenValue;
};
export declare type UseTokenValueProps = {
  valueByToken: MapTokenValue;
};

export declare type UseTokenHook = (props: UseTokenValueProps) => UseTokenValue;

export const modifyAt = (values: MapTokenValue) => (
  token: Token,
  value: BigNumberish
) =>
  pipe(
    values,
    options.map((values) => pipe(values, map.upsertAt(eqToken)(token, value)))
  );
export const modifyAtOption = (values: MapTokenValue) => (
  token: Option<Token>,
  value: BigNumberish
) =>
  pipe(
    pipe(
      token,
      options.chain((token) => modifyAt(values)(token, value)),
      options.fold(
        () => values,
        (r) => options.some(r)
      )
    )
  );

export const modifyAtTaskEither = flow(
  (
    task: taskEither.TaskEither<unknown, BigNumberish>,
    action: (token: unknown, value: BigNumberish) => void,
    target: unknown
  ) =>
    pipe(
      task,
      taskEither.map((v) => action(target, v))
    )
);

export const lookup = (values: MapTokenValue) => (token: Token) => {
  return pipe(
    values,
    options.chain((values) => pipe(values, map.lookup(eqToken)(token)))
  );
};
export const lookupOption = (values: MapTokenValue) => (token: Option<Token>) =>
  pipe(
    token,
    options.chain((token) => lookup(values)(token))
  );

export const getOrElse = (option: Option<BigNumberish>) =>
  pipe(
    option,
    options.getOrElse(() => '0.0')
  );

export const modifyAts = (values: MapTokenValue) => (
  tokens: Option<Token>[],
  amounts: BigNumberish[]
) =>
  pipe(
    amounts,
    arrays.map((a) => options.some(a)),
    (amounts) => modifyAtsOption(values)(tokens, amounts)
  );
export const modifyAtsOption = (values: MapTokenValue) => (
  tokens: Option<Token>[],
  amounts: Option<BigNumberish>[]
) =>
  pipe(
    tokens,
    arrays.zip(amounts),
    arrays.reduce(values, (acc, [token, amount]) => {
      if (options.isSome(amount)) {
        return modifyAtOption(acc)(token, amount.value);
      }
      return acc;
    })
  );
export const useTokenValues: UseTokenHook = (
  { valueByToken } = { valueByToken: options.some(new Map()) }
) => {
  const [values, setValues] = useState(valueByToken);
  const modifyAtsCallback = useCallback(
    (tokens: Option<Token>[], amounts: Option<BigNumberish>[]) => {
      setValues(modifyAtsOption(values)(tokens, amounts));
    },
    [values]
  );
  const setValue = useCallback(
    (token: Option<Token>, value: BigNumberish) => {
      setValues(pipe(modifyAtOption(values)(token, value)));
    },
    [values]
  );
  const getValue = useCallback(
    (token: Option<Token>) => {
      return lookupOption(values)(token);
    },
    [values]
  );
  return {
    modifyAts: modifyAtsCallback,
    lookup: getValue,
    modifyAt: setValue,
    values,
  };
};
