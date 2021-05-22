import { render } from '@testing-library/react';

import Piano from './piano';

describe('Piano', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <Piano play={() => {}} startNote={['C', 4]} endNote={['B', 4]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
