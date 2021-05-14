import { render } from '@testing-library/react';

import CountryTitleIcon from './country-title-icon';

describe('CountryTitleIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CountryTitleIcon />);
    expect(baseElement).toBeTruthy();
  });
});
