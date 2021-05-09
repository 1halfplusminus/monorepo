import { latLngBounds, LatLngExpression } from 'leaflet';
import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useMap } from 'react-leaflet';
import CovidMarkerPopup from './covid-marker-popup';
import CovidMarker from './marker';

const mapBounds = (positionnable: { position: LatLngExpression }[]) => {
  return latLngBounds(positionnable.map(({ position }) => position));
};

export interface CountriesMarkerProps {
  countries?: {
    position: LatLngExpression;
    name: string;
    deaths: number;
    recovered: number;
  }[];
}

export function CountriesMarker({ countries = [] }: CountriesMarkerProps) {
  const map = useMap();
  useEffect(() => {
    if (map && countries && countries.length > 0) {
      map.fitBounds(mapBounds(countries), { maxZoom: map.getZoom() });
    }
  }, [map, countries]);
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
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
  );
}

export default CountriesMarker;
