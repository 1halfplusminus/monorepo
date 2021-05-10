import { render } from '@testing-library/react';
import React from 'react';

import ContinentsMarkers from './continents-markers';
import CovidMap from './map';

window.scrollTo = jest.fn();

describe('ContinentsMarkers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CovidMap zoom={4}>
        <ContinentsMarkers />
      </CovidMap>
    );
    expect(baseElement).toBeTruthy();
  });
});
