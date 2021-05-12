import React, { FC } from 'react';
import { CountriesMarker } from './countries-marker';
import { CovidMap } from './map';
import countries from './__mocks__/countries';
import { useStatsByCountries } from '@halfoneplusminus/covid-disease.sh';

export default {
  component: CountriesMarker,
  title: 'Covid/CountriesMarker',
};

export const primary = () => {
  return (
    <CovidMap>
      <CountriesMarker displayStat="deaths" countries={countries} />
    </CovidMap>
  );
};

export const Api: FC = () => {
  const { countries } = useStatsByCountries();
  return (
    <CovidMap>
      <CountriesMarker displayStat="recovered" countries={countries} />
    </CovidMap>
  );
};
