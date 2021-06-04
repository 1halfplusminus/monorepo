import { Eq, fromEquals } from 'fp-ts/lib/Eq';
import { pipe } from 'fp-ts/lib/function';
import { Ord, fromCompare } from 'fp-ts/lib/Ord';
import { max, min } from 'fp-ts/lib/Semigroup';
import {
  intersection,
  head,
  lookup,
  updateAt,
  dropLeft,
} from 'fp-ts/lib/Array';
import { Token } from '../types';
import type { Option } from 'fp-ts/Option';
import * as options from 'fp-ts/Option';

import { useCallback, useState } from 'react';
import { toArray, fromArray, remove } from 'fp-ts/lib/Set';
import { none } from 'fp-ts/Option';

declare type TokenList = Option<Array<Option<Token>>>;
declare type Index = 0 | 1;
declare type UseTokenProps = {
  commonlyUsed: TokenList;
  tokens: TokenList;
  selected: TokenList;
};
declare type UseToken = {
  selected: TokenList;
  isSelected: (token: Token) => boolean;
  select: (token: Token) => void;
  selectAtIndex: (token: Token, index: Index) => void;
  first: Option<Token>;
  last: Option<Token>;
};
declare type UseTokenHook = (props: UseTokenProps) => UseToken;
export const selectAtIndex = (selected: TokenList) => (
  token: Token,
  index: Index
) =>
  pipe(
    selected,
    findToken(token),
    options.map((s) => pipe(s, updateAt(index, none))),
    options.fold(
      () =>
        pipe(
          selected,
          options.chain((selected) =>
            updateAt(index, options.some(token))(selected)
          )
        ),
      (v) => v
    )
  );
export const useSelectToken: UseTokenHook = ({
  commonlyUsed,
  tokens,
  selected: defaultSelected,
}) => {
  const [selected, setSelected] = useState(
    selectedOrFirstCommonlyUsed(tokens, defaultSelected, commonlyUsed)
  );

  const isSelected = useCallback(
    (token: Token) =>
      pipe(
        selected,
        options.fold(
          () => false,
          (a) => isTokenSelected(a)(token)
        )
      ),
    [selected]
  );

  return {
    selected: selected,
    isSelected,
    select: (token: Token) =>
      setSelected(
        pipe(
          selected,
          findToken(token),
          options.map((selected) =>
            pipe(
              selected,
              fromArray(eqOptionToken),
              remove(eqOptionToken)(options.some(token)),
              toArray(ordOptionToken),
              (t) => (t.length > 2 ? dropLeft(1)(t) : t),
              options.some
            )
          ),
          options.fold(
            () => options.some([options.some(token)]),
            (v) => v
          )
        )
      ),
    selectAtIndex: (token: Token, index: Index) =>
      setSelected(selectAtIndex(selected)(token, index)),
    first: pipe(
      selected,
      options.chain((tokens) => lookup(0)(tokens)),
      options.chain((t) => t)
    ),
    last: pipe(
      selected,
      options.chain((tokens) => lookup(1)(tokens)),
      options.chain((t) => t)
    ),
  };
};

export const findToken = (token: Token) => (tokens: TokenList) =>
  pipe(
    tokens,
    options.chain((tokens) =>
      pipe(
        tokens,
        options.fromPredicate(() =>
          elem(eqOptionToken)(options.some(token), tokens)
        )
      )
    )
  );

export const selectedOrFirstCommonlyUsed = (
  tokens: TokenList,
  selected: TokenList,
  commonlyUsed: TokenList
) =>
  pipe(
    selected,
    defaultSelected(tokens),

    options.fold(
      () => pipe(commonlyUsed, selectFirst(tokens)),
      (t) => options.some(t)
    )
  );

/* const nonEmptyTokens = options.fromPredicate((tokens: TokenList) =>
  isNonEmpty(tokens)
);
 */
export const selectFirst = (tokens: TokenList) => (selections: TokenList) =>
  pipe(
    selections,
    options.chain((selections) => head(selections)),
    options.map((token) => [token]),
    defaultSelected(tokens)
  );

export const defaultSelected = (tokens: TokenList) => (selected: TokenList) =>
  pipe(
    tokens,
    options.map((tokens) =>
      pipe(
        selected,
        options.map(intersectionToken(tokens)),
        options.filter((f) => f.length > 0)
      )
    ),
    options.chain((v) => v)
  );

const isTokenSelected: (tokens: TokenList) => (token: Token) => boolean = (
  tokens
) => (token) =>
  pipe(
    tokens,
    options.map((tokens) => elem(eqOptionToken)(options.some(token), tokens)),
    options.getOrElse(() => false)
  );

const eqToken = fromEquals<Token>((x, y) => x.address === y.address);
const eqOptionToken = options.getEq(eqToken);

const intersectionToken = intersection(eqOptionToken);
const ordToken: Ord<Token> = fromCompare((x, y) =>
  x.name < y.name ? -1 : x.name > y.name ? 1 : 0
);
const ordOptionToken = options.getOrd(ordToken);

/** Takes the minimum of two values */
const semigroupMin = min(ordToken);

/** Takes the maximum of two values  */
const semigroupMax = max(ordToken);

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some((item) => E.equals(item, a));
}
