import React, { ReactNode } from 'react';
import type { Option } from 'fp-ts/Option';
import * as options from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
/* eslint-disable-next-line */
export interface MaybeProps<T> {
  children?: (some: T) => ReactNode;
  onNone?: () => ReactNode;
  option?: Option<T>;
}

export function Maybe<T>({
  children,
  onNone,
  option = options.none,
}: MaybeProps<T>) {
  return (
    <>
      {pipe(
        option,
        options.fold(
          () => (onNone ? onNone() : null),
          (some) => children && children(some)
        )
      )}
    </>
  );
}

export default Maybe;
