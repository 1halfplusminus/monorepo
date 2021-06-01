import { none, some } from 'fp-ts/lib/Option';
import {
  defaultSelected,
  selectedOrFirstCommonlyUsed,
  selectFirst,
} from './tokenList';
import { DAI, ETH } from './../__mocks__/tokens';
import { Token } from '../types';
const NO_EXISTING_TOKEN: Token = {
  name: '',
  address: '',
  symbol: '',
  fullName: '',
};
describe('Token selection', () => {
  it('it should select default correctly', () => {
    expect(defaultSelected([ETH])(none)).toEqual(none);
    expect(
      defaultSelected([ETH, DAI])(some([ETH, NO_EXISTING_TOKEN]))
    ).toStrictEqual(some([ETH]));
    expect(
      defaultSelected([ETH, DAI])(some([ETH, NO_EXISTING_TOKEN]))
    ).toStrictEqual(some([ETH]));
    expect(defaultSelected([ETH, DAI])(some([NO_EXISTING_TOKEN]))).toEqual(
      none
    );
  });
  it('it should select first token from commonly used as default', () => {
    expect(selectFirst([ETH])(none)).toEqual(none);
    expect(selectFirst([ETH, DAI])(some([DAI, ETH]))).toStrictEqual(
      some([DAI])
    );
  });

  it('it should select default correctly', () => {
    const tokens = [ETH, DAI];
    const commenlyUsed = none;
    const selected = some([DAI]);
    expect(
      selectedOrFirstCommonlyUsed(tokens, selected, commenlyUsed)
    ).toStrictEqual(some([DAI]));
    expect(
      selectedOrFirstCommonlyUsed(tokens, none, some([ETH, DAI]))
    ).toStrictEqual(some([ETH]));
    expect(
      selectedOrFirstCommonlyUsed(tokens, none, some([ETH]))
    ).toStrictEqual(some([ETH]));
    expect(selectedOrFirstCommonlyUsed(tokens, none, none)).toStrictEqual(none);
  });
});
