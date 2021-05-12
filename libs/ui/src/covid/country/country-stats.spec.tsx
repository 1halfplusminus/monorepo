import { render } from '@testing-library/react';
import countries from '../__mocks__/countries';

import CountryStats from './country-stats';

describe('CountryStats', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <CountryStats country={countries[0]} onStatClick={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
