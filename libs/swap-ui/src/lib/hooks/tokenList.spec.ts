import { none, some } from 'fp-ts/lib/Option';
import {
  defaultSelected,
  selectedOrFirstCommonlyUsed,
  selectFirst,
} from './tokenList';
import { DAI, ETH } from './../__mocks__/tokens';
import { selectAtIndex, searchToken } from './tokenList';

describe('Token selection', () => {
  it('it should search token correctly', () => {
    const tokens = some([some(ETH), some(DAI)]);
    expect(searchToken(tokens)('zzzz')).toStrictEqual(none);
    expect(searchToken(tokens)('eth')).toStrictEqual(some([some(ETH)]));
  });
  it('it should select default correctly', () => {
    expect(defaultSelected(some([some(ETH)]))(none)).toEqual(none);
  });
  it('it should select first token from commonly used as default', () => {
    expect(selectFirst(some([some(ETH)]))(none)).toEqual(none);
    expect(
      selectFirst(some([some(ETH), some(DAI)]))(some([some(DAI), some(ETH)]))
    ).toStrictEqual(some([some(DAI)]));
  });

  it('it should select default correctly', () => {
    const tokens = some([some(ETH), some(DAI)]);
    const commenlyUsed = none;
    const selected = some([some(DAI)]);

    expect(
      selectedOrFirstCommonlyUsed(tokens, some([none, none]), some([some(ETH)]))
    ).toStrictEqual(some([some(ETH), none]));
    expect(
      selectedOrFirstCommonlyUsed(tokens, selected, commenlyUsed)
    ).toStrictEqual(some([some(DAI)]));
    expect(
      selectedOrFirstCommonlyUsed(tokens, none, some([some(ETH), some(DAI)]))
    ).toStrictEqual(some([some(ETH)]));
    expect(
      selectedOrFirstCommonlyUsed(tokens, none, some([some(ETH)]))
    ).toStrictEqual(some([some(ETH)]));
    expect(selectedOrFirstCommonlyUsed(tokens, none, none)).toStrictEqual(none);
  });
  it('it should select at index correctly', () => {
    const selected = some([some(ETH), none]);
    expect(selectAtIndex(selected)(ETH, 1)).toStrictEqual(
      some([none, some(ETH)])
    );
    expect(selectAtIndex(selected)(DAI, 1)).toStrictEqual(
      some([some(ETH), some(DAI)])
    );
    expect(selectAtIndex(selected)(DAI, 0)).toStrictEqual(
      some([some(DAI), none])
    );
    expect(selectAtIndex(selected)(ETH, 0)).toStrictEqual(some([none, none]));
    expect(selectAtIndex(some([some(ETH), some(DAI)]))(ETH, 1)).toStrictEqual(
      some([some(DAI), some(ETH)])
    );
  });
});
