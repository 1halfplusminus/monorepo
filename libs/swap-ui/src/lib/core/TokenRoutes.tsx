import Maybe from '../../core/maybe/maybe';
import { TokenList } from '../hooks/tokenList';
import { array as A, option as O } from 'fp-ts';
import { pipe } from 'fp-ts/function';
export const TokenRoutes = ({ tokens }: { tokens: TokenList }) => (
  <Maybe option={tokens}>
    {(tokens) =>
      pipe(
        tokens,
        A.reduce('', (acc, oT) =>
          pipe(
            oT,
            O.fold(
              () => acc,
              (t) =>
                pipe(
                  acc,
                  (acc) => (!acc ? acc : acc + ' >'),
                  (acc) => acc + ' ' + t.name
                )
            )
          )
        )
      )
    }
  </Maybe>
);
