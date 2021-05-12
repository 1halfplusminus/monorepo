import { render } from '@testing-library/react';
import { MapContainer } from 'react-leaflet';
import Marker from './marker';

describe('Marker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MapContainer>
        <Marker position={[50, 50]} />
      </MapContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});
