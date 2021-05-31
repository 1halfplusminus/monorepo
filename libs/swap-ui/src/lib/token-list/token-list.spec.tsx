import { render } from '@testing-library/react';

import TokenList from './token-list';

describe('TokenList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TokenList />);
    expect(baseElement).toBeTruthy();
  });
});
