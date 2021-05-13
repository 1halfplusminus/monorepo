import { render } from '@testing-library/react';

import StatistiqueCard from './statistique-card';

describe('StatistiqueCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <StatistiqueCard type="info" value={0} description="cool" />
    );
    expect(baseElement).toBeTruthy();
  });
});
