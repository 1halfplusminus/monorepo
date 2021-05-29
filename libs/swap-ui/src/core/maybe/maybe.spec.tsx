import { render } from '@testing-library/react';
import { none } from 'fp-ts/lib/Option';

import Maybe from './maybe';

describe('Maybe', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Maybe option={none} />);
    expect(baseElement).toBeTruthy();
  });
});
