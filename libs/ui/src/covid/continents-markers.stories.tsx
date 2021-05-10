import React from 'react';
import { useStatsByContinents } from '@halfoneplusminus/covid-disease.sh';
import {
  ContinentsMarkers,
  ContinentsMarkersProps,
} from './continents-markers';
import CovidMap from './map';

export default {
  component: ContinentsMarkers,
  title: 'ContinentsMarkers',
};

export const Api = () => {
  const { continents } = useStatsByContinents();
  /* eslint-disable-next-line */
  const props: ContinentsMarkersProps = { continents };

  return (
    <CovidMap zoom={3}>
      <ContinentsMarkers {...props} />
    </CovidMap>
  );
};
