import { Eq, fromEquals } from 'fp-ts/lib/Eq';
import { flow, pipe } from 'fp-ts/lib/function';
import { Ord, fromCompare } from 'fp-ts/lib/Ord';

import {
  head,
  lookup,
  updateAt,
  dropLeft,
  findIndex,
  filter,
  insertAt,
} from 'fp-ts/Array';
import { Token } from '../types';
import type { Option } from 'fp-ts/Option';
import * as options from 'fp-ts/Option';
import { useCallback, useState } from 'react';
import { toArray, fromArray, remove } from 'fp-ts/Set';
import { useMemo } from 'react';
import { selected } from '../token-select/token-select.stories';

export declare type TokenList = Option<Array<Option<Token>>>;
declare type Index = 0 | 1;
declare type UseTokenProps = {
  commonlyUsed?: TokenList;
  tokens: TokenList;
  selected?: TokenList;
};
declare type UseToken = {
  selected: TokenList;
  isSelected: (token: Token) => boolean;
  select: (token: Token) => void;
  selectAtIndex: (token: Token, index: Index) => void;
  first: Option<Token>;
  last: Option<Token>;
  inverse: () => void;
};
declare type UseTokenHook = (props: UseTokenProps) => UseToken;
const selectedOrDefault = (selected: TokenList) =>
  pipe(
    selected,
    options.getOrElse<options.Option<Token>[]>(() => [
      options.none,
      options.none,
    ]),
    options.of
  );
export const selectAtIndex = (selected: TokenList) => (
  token: Token,
  index: Index
) =>
  pipe(selectedOrDefault(selected), (selected) =>
    pipe(
      selected,
      findToken(token),
      options.chain((s) =>
        pipe(
          s,
          findIndex((a) => eqOptionToken.equals(a, options.some(token))),
          options.map((foundIndex) =>
            pipe(
              s,
              updateAt<Option<Token>>(
                foundIndex,
                pipe(
                  lookup(index)(s),
                  options.filter(() => index !== foundIndex),
                  options.chain((v) => v)
                )
              ),
              options.chain((r) =>
                index !== foundIndex
                  ? updateAt(index, options.some(token))(r)
                  : options.some(r)
              )
            )
          )
        )
      ),
      options.getOrElse(() =>
        pipe(
          selected,
          options.chain((selected) =>
            updateAt(index, options.some(token))(selected)
          ),
          (remove) => {
            return remove;
          }
        )
      )
    )
  );
export const useSelectToken: UseTokenHook = ({
  commonlyUsed = options.some([]),
  tokens,
  selected: defaultSelected = options.some([options.none, options.none]),
}) => {
  const [selected, setSelected] = useState(
    selectedOrFirstCommonlyUsed(tokens, defaultSelected, commonlyUsed)
  );

  const isSelected = useCallback(
    (token: Token) => pipe(selected, isTokenSelected(token)),
    [selected]
  );
  const setSelectedAtIndex = useCallback(
    (token: Token, index: Index) =>
      setSelected(selectAtIndex(selected)(token, index)),
    [selected]
  );
  const last = useMemo(
    () =>
      pipe(
        selected,
        options.chain((tokens) => lookup(1)(tokens)),
        options.chain((t) => t)
      ),
    [selected]
  );
  const first = useMemo(
    () =>
      pipe(
        selected,
        options.chain((tokens) => lookup(0)(tokens)),
        options.chain((t) => t)
      ),
    [selected]
  );
  const inverse = useCallback(
    () =>
      flow(
        () =>
          pipe(
            last,
            options.map((last) => setSelectedAtIndex(last, 0))
          ),
        () =>
          pipe(
            first,
            options.map((first) => setSelectedAtIndex(first, 1))
          )
      )(),
    [last, first, setSelectedAtIndex]
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
    selectAtIndex: setSelectedAtIndex,
    first,
    last,
    inverse,
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
      () =>
        pipe(
          commonlyUsed ? commonlyUsed : options.none,
          options.chain((commonlyUsed) => lookup(0)(commonlyUsed)),
          options.map((r) => [r])
        ),
      (t) =>
        pipe(
          t,
          lookup(0),
          options.filter((o) => options.isSome(o)),
          options.fold(
            () =>
              pipe(
                commonlyUsed,
                options.chain((commonlyUsed) => lookup(0)(commonlyUsed)),
                options.chain((r) => updateAt(0, r)(t))
              ),
            () => options.some(t)
          )
        )
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
    tokens ? tokens : options.some([]),
    options.map(() =>
      pipe(
        selected
        /*         options.map(intersectionToken(tokens)), */
      )
    ),
    options.chain((v) => v)
  );

const isTokenSelected: (token: Token) => (tokens: TokenList) => boolean = (
  token
) => (tokens) =>
  pipe(
    tokens,
    options.map((tokens) => elem(eqOptionToken)(options.some(token), tokens)),
    options.getOrElse(() => false)
  );

export const eqToken = fromEquals<Token>((x, y) => x.address === y.address);

const eqOptionToken = options.getEq(eqToken);

const ordToken: Ord<Token> = fromCompare((x, y) =>
  x.name < y.name ? -1 : x.name > y.name ? 1 : 0
);
const ordOptionToken = options.getOrd(ordToken);

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some((item) => E.equals(item, a));
}
const fullTextSearchToken = (token: Token) => (query: string) =>
  token.name.toLowerCase().includes(query.toLowerCase());

const fullTextSearchOptionToken = (token: Option<Token>) => (query: string) =>
  pipe(
    token,
    options.map((t) => fullTextSearchToken(t)(query)),
    options.getOrElse(() => false)
  );

export const searchToken = (tokens: TokenList) => (query: string) =>
  pipe(
    tokens,
    options.map((tokens) =>
      pipe(
        tokens,
        filter((token) => fullTextSearchOptionToken(token)(query))
      )
    ),
    options.filter((tokens) => tokens.length > 0)
  );

export const useSearch = (
  tokenList: TokenList,
  initialQuery: Option<string> = options.none
) => {
  const [query, setQuery] = useState<Option<string>>(initialQuery);
  const search = (query: string) => {
    setQuery(
      pipe(
        query,
        options.fromPredicate(() => query.length > 0)
      )
    );
  };
  const filteredTokenList = useMemo(
    () =>
      pipe(
        query,
        options.map((query) => searchToken(tokenList)(query)),
        options.getOrElse(() => tokenList)
      ),
    [tokenList, query]
  );
  return {
    filteredTokenList,
    search,
  };
};
