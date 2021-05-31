import { none, some } from 'fp-ts/lib/Option';
import { defaultSelected, selectFirst } from './tokenList';
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
    expect(selectFirst([ETH, DAI])(some([DAI, ETH]))).toStrictEqual([DAI]);
  });
});
