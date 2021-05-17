import React from 'react';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  Layout,
  useDashboard,
  TwoColumns,
  CountryStats,
  Header,
} from '@halfoneplusminus/ui';
import dynamic from 'next/dynamic';
import type {
  CovidMapProps,
  CountriesMarkerProps,
} from '@halfoneplusminus/covid-map';

const Map = dynamic<CovidMapProps>(
  () => import('@halfoneplusminus/covid-map').then((mod) => mod.CovidMap),
  { ssr: false }
);
const Markers = dynamic<CountriesMarkerProps>(
  () =>
    import('@halfoneplusminus/covid-map').then((mod) => mod.CountriesMarker),
  { ssr: false }
);
export function Index() {
  const date = new Date();
  const {
    bindCountriesMarker,
    bindCountryStats,
    bindDatePicker,
  } = useDashboard(date);

  return (
    <Layout
      main={
        <TwoColumns
          left={
            <Map>
              <Markers {...bindCountriesMarker()} />
            </Map>
          }
          right={<CountryStats {...bindCountryStats()} />}
        />
      }
      header={<Header title="Covid Pacifique" {...bindDatePicker()} />}
    />
  );
}

export default Index;
