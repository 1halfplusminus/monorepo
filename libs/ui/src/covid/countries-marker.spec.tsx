import { render } from '@testing-library/react';
import CountriesMarker from './countries-marker';
import { MapContainer } from 'react-leaflet';
import countries from './__mocks__/countries';

describe('CountriesMarker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MapContainer>
        <CountriesMarker countries={countries} />
      </MapContainer>
    );
    expect(baseElement).toBeTruthy();
  });
  it('should render successfully if countries is null', () => {
    const { baseElement } = render(
      <MapContainer>
        <CountriesMarker countries={null} />
      </MapContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});
