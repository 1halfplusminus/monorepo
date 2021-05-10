import { LatLngExpression } from 'leaflet';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import CovidMarkerPopup from './covid-marker-popup';
import CovidMarker from './marker';
import { useFitBounds } from './utils';

export interface CountriesMarkerProps {
  countries?: {
    position: LatLngExpression;
    name: string;
    deaths: number;
    recovered: number;
  }[];
}

export function CountriesMarker({ countries = [] }: CountriesMarkerProps) {
  const { isVisible } = useFitBounds(countries, {
    visibleAtZoomLevel: [4, 100],
  });
  return (
    isVisible && (
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          // TODO: ERROR MARKER
          <CovidMarker position={[0, 0]}>
            <CovidMarkerPopup name={'error'} />
          </CovidMarker>
        )}
      >
        {countries.map(({ position, name, deaths }) => (
          <CovidMarker key={name} position={position}>
            <CovidMarkerPopup name={name} deaths={deaths} />
          </CovidMarker>
        ))}
      </ErrorBoundary>
    )
  );
}

export default CountriesMarker;
