import { render } from '@testing-library/react';

import TitleIcon from './title-icon';

describe('TitleIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TitleIcon />);
    expect(baseElement).toBeTruthy();
  });
});
