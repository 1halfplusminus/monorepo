import { LatLngExpression } from 'leaflet';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import CovidMarkerPopup from './covid-marker-popup';
import CovidMarker from './marker';
import { useFitBounds } from './utils';
import countries from './__mocks__/countries';

/* eslint-disable-next-line */
export interface ContinentsMarkersProps {
  continents?: {
    position: LatLngExpression;
    name: string;
    deaths: number;
  }[];
}

export function ContinentsMarkers({ continents = [] }: ContinentsMarkersProps) {
  const { isVisible } = useFitBounds(countries, {
    visibleAtZoomLevel: [0, 2],
  });
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        // TODO: ERROR MARKER
        <CovidMarker position={[0, 0]}>
          <CovidMarkerPopup name={'error'} />
        </CovidMarker>
      )}
    >
      {isVisible &&
        continents?.map(({ position, name, deaths }) => (
          <CovidMarker key={name} position={position}>
            <CovidMarkerPopup name={name} deaths={deaths} />
          </CovidMarker>
        ))}
    </ErrorBoundary>
  );
}

export default ContinentsMarkers;
