import { tokenList } from '../__mocks__';
import { record as R, nonEmptyArray as NEA } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { filterByChainId } from '../index';

export const getMockTokens = () =>
  pipe(
    tokenList,
    filterByChainId(1),
    NEA.groupBy((t) => t.symbol),
    R.map((v) => v[0])
  );
