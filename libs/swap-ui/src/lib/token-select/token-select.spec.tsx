import { render } from '@testing-library/react';
import { none } from 'fp-ts/lib/Option';

import TokenSelect from './token-select';

describe('TokenSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TokenSelect selected={none} />);
    expect(baseElement).toBeTruthy();
  });
});
