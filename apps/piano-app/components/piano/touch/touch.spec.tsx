import { render } from '@testing-library/react';

import Touch from './touch';

describe('Touch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <Touch onMouseUp={() => {}} onMouseDown={() => {}} note={['A', 1]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
