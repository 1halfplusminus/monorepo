import { render } from '@testing-library/react';

import SearchToken from './search-token';

describe('SearchToken', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchToken />);
    expect(baseElement).toBeTruthy();
  });
});
