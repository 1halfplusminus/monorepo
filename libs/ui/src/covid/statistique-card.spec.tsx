import { render } from '@testing-library/react';

import StatistiqueCard from './statistique-card';

describe('StatistiqueCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StatistiqueCard />);
    expect(baseElement).toBeTruthy();
  });
});
