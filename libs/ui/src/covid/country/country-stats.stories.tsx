import React, { useState } from 'react';
import CountriesMarker from '../countries-marker';
import Layout, { LayoutProps, TwoColumns } from '../layout/layout';
import { CovidMap } from '../map';
import { CountryStats, useCountryStats } from './country-stats';
import { useStatsByCountries } from '@halfoneplusminus/covid-disease.sh';

export default {
  component: CountryStats,
  title: 'Covid/CountryStats',
};

export const Primary = () => {
  const { countries } = useStatsByCountries();
  const { bindCountryStats, bindCountriesMarker } = useCountryStats({
    country: countries?.[0],
  });
  /* eslint-disable-next-line */
  const props: LayoutProps = {
    debug: true,
    main: (
      <TwoColumns
        left={
          <CovidMap>
            <CountriesMarker {...bindCountriesMarker()} countries={countries} />
          </CovidMap>
        }
        right={<CountryStats {...bindCountryStats()} />}
      />
    ),
    header: '',
  };

  return <Layout {...props} />;
};
