import React, { FC } from 'react';
import { CountriesMarker } from './countries-marker';
import { CovidMap } from './map';
import countries from './__mocks__/countries';
import { useStatsByCountries } from '@halfoneplusminus/covid-disease.sh';
export default {
  component: CountriesMarker,
  title: 'CountriesMarker',
};

export const primary = () => {
  return (
    <CovidMap>
      <CountriesMarker countries={countries} />
    </CovidMap>
  );
};

export const Api: FC = () => {
  const { countries } = useStatsByCountries();
  return (
    <CovidMap>
      <CountriesMarker countries={countries} />
    </CovidMap>
  );
};
