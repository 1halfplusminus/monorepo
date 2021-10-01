import { tokenList } from '../__mocks__';
import { record as R, nonEmptyArray as NEA } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { filterByChainId } from '../index';

export const getMockTokens = (chaindId: number = 1) =>
  pipe(
    tokenList,
    filterByChainId(chaindId),
    NEA.groupBy((t) => t.symbol),
    R.map((v) => v[0])
  );
