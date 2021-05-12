import { render } from '@testing-library/react';

import NumberFormat from './number-format';

describe('NumberFormat', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NumberFormat />);
    expect(baseElement).toBeTruthy();
  });
});
