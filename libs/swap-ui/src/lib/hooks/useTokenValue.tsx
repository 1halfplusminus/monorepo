import { Token } from '../types';
import { BigNumberish, BigNumber } from 'ethers';
import { Option } from 'fp-ts/Option';
import * as map from 'fp-ts/Map';
import { useState } from 'react';
import { pipe, flow } from 'fp-ts/function';
import * as options from 'fp-ts/Option';
import { eqToken } from './tokenList';
import * as taskEither from 'fp-ts/TaskEither';
import type { TaskEither } from 'fp-ts/TaskEither';

export type MapTokenValue = Option<Map<Token, BigNumberish>>;

export type UseTokenValue = {
  lookup(token: Option<Token>): Option<BigNumberish>;
  modifyAt(token: Option<Token>, value: BigNumberish): void;
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
    token,
    options.chain((token) => modifyAt(values)(token, value))
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
export const useTokenValues: UseTokenHook = (
  { valueByToken } = { valueByToken: options.some(new Map()) }
) => {
  const [values, setValues] = useState(valueByToken);
  const setValue = (token: Option<Token>, value: BigNumberish) => {
    setValues(modifyAtOption(values)(token, value));
  };
  const getValue = (token: Option<Token>) => {
    return lookupOption(values)(token);
  };
  return {
    lookup: getValue,
    modifyAt: setValue,
  };
};
