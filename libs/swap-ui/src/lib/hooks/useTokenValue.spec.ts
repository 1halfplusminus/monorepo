import {
  lookup,
  MapTokenValue,
  modifyAt,
  lookupOption,
  modifyAtOption,
  modifyAtTaskEither,
} from './useTokenValue';
import { none, some, map } from 'fp-ts/Option';
import { DAI, ETH, USDC } from '../__mocks__/tokens';
import * as taskEither from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

const fetchBalance = taskEither.tryCatch(
  async () => 4,
  () => 'error'
);
describe('UseTokenValue', () => {
  it('should get value correctly', () => {
    const tokens: MapTokenValue = some(
      new Map().set(ETH, 100000).set(DAI, 100)
    );
    expect(lookup(tokens)(ETH)).toStrictEqual(some(100000));
    expect(lookup(tokens)(DAI)).toStrictEqual(some(100));
    expect(lookup(tokens)(USDC)).toStrictEqual(none);

    expect(lookupOption(tokens)(none)).toStrictEqual(none);
  });
  it('should set value correctly', () => {
    const tokens: MapTokenValue = some(
      new Map().set(ETH, 100000).set(DAI, 100)
    );
    expect(
      pipe(modifyAtOption(some(new Map()))(some(ETH), 100), (r) =>
        modifyAtOption(r)(some(DAI), 100)
      )
    ).toStrictEqual(some(new Map().set(ETH, 100).set(DAI, 100)));
    return;
    expect(lookup(modifyAt(tokens)(ETH, 100))(ETH)).toStrictEqual(some(100));
    expect(lookup(modifyAt(tokens)(DAI, 500))(DAI)).toStrictEqual(some(500));
    expect(lookup(modifyAt(tokens)(USDC, 1))(USDC)).toStrictEqual(some(1));

    expect(
      lookupOption(modifyAtOption(tokens)(none, 1000))(none)
    ).toStrictEqual(none);
    expect(
      lookupOption(modifyAtOption(tokens)(none, 1000))(some(ETH))
    ).toStrictEqual(some(100000));

    expect(
      lookupOption(modifyAtOption(tokens)(some(ETH), 1000))(some(ETH))
    ).toStrictEqual(some(1000));

    modifyAtTaskEither(fetchBalance, modifyAt(tokens), ETH)();
  });
});
