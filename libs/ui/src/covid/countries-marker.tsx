import { LatLngExpression } from 'leaflet';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Tooltip } from 'react-leaflet';
import { CountryStatistics, Country } from '@halfoneplusminus/covid';
import CovidMarker from './marker';
import { getStatType, useFitBounds } from './utils';

export interface CountriesMarkerProps {
  countries?: Country[];
  displayStat?: CountryStatistics;
  onClick?: (country: Country) => void;
}

export function CountriesMarker({
  countries = [],
  displayStat = 'recovered',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick = () => {},
}: CountriesMarkerProps) {
  const { isVisible } = useFitBounds(countries, {
    visibleAtZoomLevel: [4, 100],
  });
  const handleClick = (country: Country) => {
    return () => {
      onClick(country);
    };
  };
  return (
    isVisible && (
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          // TODO: ERROR MARKER
          <CovidMarker type="danger" value={10} position={[0, 0]} />
        )}
      >
        {countries.map(({ position, name, ...stats }, index) => (
          <CovidMarker
            type={getStatType(displayStat)}
            value={stats[displayStat]}
            key={'marker-' + index}
            position={position}
            onClick={handleClick({ position, name, ...stats })}
          >
            <Tooltip>{name}</Tooltip>
          </CovidMarker>
        ))}
      </ErrorBoundary>
    )
  );
}

export default CountriesMarker;
