import { LatLngExpression } from 'leaflet';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Tooltip } from 'react-leaflet';
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
        <CovidMarker value={0} type="danger" position={[0, 0]}>
          <CovidMarkerPopup name={'error'} />
        </CovidMarker>
      )}
    >
      {isVisible &&
        continents?.map(({ position, name, deaths }) => (
          <CovidMarker
            value={deaths}
            type="danger"
            key={name}
            position={position}
          >
            <Tooltip>{name}</Tooltip>
          </CovidMarker>
        ))}
    </ErrorBoundary>
  );
}

export default ContinentsMarkers;
