import { render } from '@testing-library/react';

import TokenSymbol from './token-symbol';

describe('TokenSymbol', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TokenSymbol />);
    expect(baseElement).toBeTruthy();
  });
});
