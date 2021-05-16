import React from 'react';
import { CountriesMarker, CountriesMarkerProps } from './countries-marker';
import { CovidMap } from './map';
import countries from './__mocks__/countries';
import { useStatsByCountries } from '@halfoneplusminus/covid-disease.sh';
import { useOceaniaCountriesFilter } from '@halfoneplusminus/covid';
import { Meta, Story } from '@storybook/react';

export default {
  component: CountriesMarker,
  title: 'Covid/CountriesMarker',
} as Meta;

export const primary: Story<CountriesMarkerProps> = (args) => {
  return (
    <CovidMap>
      <CountriesMarker {...args} displayStat="deaths" countries={countries} />
    </CovidMap>
  );
};
const date = new Date();

export const Api = (args: CountriesMarkerProps) => {
  const { countries } = useStatsByCountries(date);
  const { countries: filteredCountries } = useOceaniaCountriesFilter({
    countries,
  });
  return (
    <CovidMap>
      <CountriesMarker
        {...args}
        displayStat="recovered"
        countries={filteredCountries}
      />
    </CovidMap>
  );
};
