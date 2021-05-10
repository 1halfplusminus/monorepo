import { render } from '@testing-library/react';

import CovidMap from './map';

describe('Map', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CovidMap zoom={5} />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
