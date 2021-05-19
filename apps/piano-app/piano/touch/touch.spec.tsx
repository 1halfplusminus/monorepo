import { render } from '@testing-library/react';

import Touch from './touch';

describe('Touch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Touch onTouch={() => {}} note={['A', 1]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
