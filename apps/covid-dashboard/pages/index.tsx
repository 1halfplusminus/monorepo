import React from 'react';
import styled from 'styled-components';
import {
  Layout,
  useDashboard,
  TwoColumns,
  CountryStats,
  Header,
} from '@halfoneplusminus/ui';
const StyledPage = styled.div`
  .page {
  }
`;

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
          left={<></>}
          right={<CountryStats {...bindCountryStats()} />}
        />
      }
      header={<Header title="Covid Pacifique" {...bindDatePicker()} />}
    />
  );
}

export default Index;
