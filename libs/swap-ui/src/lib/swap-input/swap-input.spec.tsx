import { render } from '@testing-library/react';

import SwapInput from './swap-input';

describe('SwapInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SwapInput />);
    expect(baseElement).toBeTruthy();
  });
});
