import { render } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';

import CovidMarkerPopup from './covid-marker-popup';

describe('CovidMarketPopup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MapContainer>
        <CovidMarkerPopup name="Test Country" stat={999} />
      </MapContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});
