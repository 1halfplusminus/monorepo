import React from 'react';
import CountriesMarker from '../countries-marker';
import Layout, { LayoutProps, TwoColumns } from '../layout/layout';
import { CovidMap } from '../map';
import { CountryStats, useCountryStats } from './country-stats';
import Header from '../../header/header';
import { useDashboard } from '../dashboard/hook';

export default {
  component: CountryStats,
  title: 'Covid/CountryStats',
};
const date = new Date(2021, 3, 17);

export const Primary = () => {
  const {
    bindCountriesMarker,
    bindCountryStats,
    bindDatePicker,
  } = useDashboard(date);
  /* eslint-disable-next-line */
  const props: LayoutProps = {
    main: (
      <TwoColumns
        left={
          <CovidMap>
            <CountriesMarker {...bindCountriesMarker()} />
          </CovidMap>
        }
        right={<CountryStats {...bindCountryStats()} />}
      />
    ),
    header: <Header title="Covid Pacifique" {...bindDatePicker()} />,
  };

  return <Layout {...props} />;
};
