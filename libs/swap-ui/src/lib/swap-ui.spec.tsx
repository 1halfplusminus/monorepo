import { render } from '@testing-library/react';

import SwapUi from './swap-ui';

describe('SwapUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SwapUi />);
    expect(baseElement).toBeTruthy();
  });
});
