import { Eq, fromEquals } from 'fp-ts/lib/Eq';
import { pipe } from 'fp-ts/lib/function';
import { Ord, fromCompare } from 'fp-ts/lib/Ord';
import { max, min } from 'fp-ts/lib/Semigroup';
import { intersection, head, append, dropLeft } from 'fp-ts/lib/Array';
import { Token } from '../types';
import type { Option } from 'fp-ts/Option';
import * as options from 'fp-ts/Option';
import { isNonEmpty } from 'fp-ts/lib/ReadonlyArray';

import { useState } from 'react';
import { toArray, fromArray, remove } from 'fp-ts/lib/Set';

declare type UseTokenProps = {
  commonlyUsed: Option<Token[]>;
  tokens: Array<Token>;
  selected: Option<Token[]>;
};
declare type UseToken = {
  selected: Option<Token[]>;
  isSelected: (token: Token) => boolean;
  select: (token: Token) => void;
};
declare type UseTokenHook = (props: UseTokenProps) => UseToken;

export const useSelectToken: UseTokenHook = ({
  commonlyUsed,
  tokens,
  selected: defaultSelected,
}) => {
  const [selected, setSelected] = useState(
    selectedOrFirstCommonlyUsed(tokens, defaultSelected, commonlyUsed)
  );
  return {
    selected: selected,
    isSelected: (token: Token) =>
      pipe(
        selected,
        options.fold(
          () => false,
          (a) => isSelected(a)(token)
        )
      ),
    select: (token: Token) =>
      setSelected(
        pipe(
          selected,
          options.fold(
            () => options.some([token]),
            (selected) =>
              pipe(
                selected,
                findToken(token),
                options.fold(
                  () => options.some(selected),
                  () => options.none
                ),
                options.fold(
                  () =>
                    pipe(
                      selected,
                      fromArray(eqToken),
                      remove(eqToken)(token),
                      toArray(ordToken)
                    ),
                  (tokens) => append(token)(tokens)
                ),
                (t) => (t.length > 2 ? dropLeft(1)(t) : t),
                options.some
              )
          )
        )
      ),
  };
};

export const findToken = (token: Token) => (tokens: Token[]) =>
  pipe(
    token,
    options.fromPredicate((t) => elem(eqToken)(t, tokens))
  );

export const selectedOrFirstCommonlyUsed = (
  tokens: Token[],
  selected: Option<Token[]>,
  commonlyUsed: Option<Token[]>
) =>
  pipe(
    selected,
    defaultSelected(tokens),
    options.fold(
      () => selectFirst(tokens)(commonlyUsed),
      (t) => options.some(t)
    )
  );

const nonEmptyTokens = options.fromPredicate((tokens: Token[]) =>
  isNonEmpty(tokens)
);

export const selectFirst = (tokens: Token[]) => (selections: Option<Token[]>) =>
  pipe(
    selections,
    options.chain((used) => head(used)),
    options.map((token) => [token]),
    defaultSelected(tokens)
  );

export const defaultSelected = (tokens: Token[]) => (
  selected: Option<Token[]>
) =>
  pipe(
    selected,
    options.map((selected) => pipe(tokens, intersectionToken(selected))),
    options.chain((tokens) => nonEmptyTokens(tokens))
  );

const isSelected: (tokens: Token[]) => (token: Token) => boolean = (tokens) => (
  token
) => elem(eqToken)(token, tokens);

const eqToken = fromEquals<Token>((x, y) => x.address === y.address);

const intersectionToken = intersection(eqToken);
const ordToken: Ord<Token> = fromCompare((x, y) =>
  x.name < y.name ? -1 : x.name > y.name ? 1 : 0
);

/** Takes the minimum of two values */
const semigroupMin = min(ordToken);

/** Takes the maximum of two values  */
const semigroupMax = max(ordToken);

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some((item) => E.equals(item, a));
}
