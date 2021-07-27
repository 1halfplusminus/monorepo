import { mergeInformation, ordChainId } from './index';
import { tokenList } from './__mocks__';
import {
  nonEmptyArray as NEA,
  record as R,
  option as O,
  array as A,
  ord as ORD,
} from 'fp-ts';
import { pipe } from 'fp-ts/function';
describe('Function on list item ', () => {
  it('it should filter by chain correctly', () => {
    const mergedInformation = pipe(
      tokenList,
      A.sort(ORD.reverse(ordChainId)),
      mergeInformation(3),
      NEA.groupBy((i) => i.symbol)
    );
    const nonMerged = pipe(
      tokenList,
      NEA.groupBy((i) => i.symbol),
      R.map(NEA.sort(ordChainId))
    );
    expect(mergedInformation['WETH'][0].logoURI).toEqual(
      nonMerged['WETH'][0].logoURI
    );
  });
});
