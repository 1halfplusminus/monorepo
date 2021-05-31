import { SemigroupAll } from 'fp-ts/lib/boolean';
import { Eq, fromEquals } from 'fp-ts/lib/Eq';

import { pipe } from 'fp-ts/lib/function';
import { Ord, fromCompare } from 'fp-ts/lib/Ord';
import { first, max, min } from 'fp-ts/lib/Semigroup';
import { flatten, intersection, tail, head, append } from 'fp-ts/lib/Array';
import { union } from 'fp-ts/lib/Set';
import { getSemigroup } from 'fp-ts/lib/These';
import { Token } from '../types';
import type { Option } from 'fp-ts/Option';
import * as options from 'fp-ts/Option';
import { isNonEmpty } from 'fp-ts/lib/ReadonlyArray';
declare type UseTokenProps = {
  commonlyUsed: Option<Token[]>;
  tokens: Array<Token>;
  selected: Option<Token[]>;
};
declare type UseToken = {
  selected: Token[];
  isSelected: (token: Token) => boolean;
};
declare type UseTokenHook = (props: UseTokenProps) => UseToken;

const useSelectToken: UseTokenHook = ({
  commonlyUsed,
  tokens,
  selected: defaultSelected,
}) => {
  return {
    selected: defaultSelected,
    isSelected: () => true,
  };
};

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

const eqToken = fromEquals<Token>((x, y) => x.name === y.name);

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
