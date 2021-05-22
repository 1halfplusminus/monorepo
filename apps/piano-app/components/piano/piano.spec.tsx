import { render } from '@testing-library/react';

import Piano from './piano';

describe('Piano', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Piano />);
    expect(baseElement).toBeTruthy();
  });
});
