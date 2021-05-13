import React, { useState } from 'react';
import CountriesMarker from '../countries-marker';
import Layout, { LayoutProps, TwoColumns } from '../layout/layout';
import { CovidMap } from '../map';
import { CountryStats, useCountryStats } from './country-stats';
import { useStatsByCountries } from '@halfoneplusminus/covid-disease.sh';
import { useOceaniaCountriesFilter } from '@halfoneplusminus/covid';
import Header from '../../header/header';
import { useHeaderDatePickerState } from '../../header/hooks';

export default {
  component: CountryStats,
  title: 'Covid/CountryStats',
};

export const Primary = () => {
  const { countries } = useStatsByCountries();
  const { countries: filteredCountries } = useOceaniaCountriesFilter({
    countries,
  });
  const { bindCountryStats, bindCountriesMarker } = useCountryStats({
    country: filteredCountries?.[0],
  });
  /* eslint-disable-next-line */
  const props: LayoutProps = {
    main: (
      <TwoColumns
        left={
          <CovidMap>
            <CountriesMarker
              {...bindCountriesMarker()}
              countries={filteredCountries}
            />
          </CovidMap>
        }
        right={<CountryStats {...bindCountryStats()} />}
      />
    ),
    header: (
      <Header
        title="Covid Pacifique"
        {...useHeaderDatePickerState({ date: new Date() })}
      />
    ),
  };

  return <Layout {...props} />;
};
