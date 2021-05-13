import React from 'react';
import { useStatsByContinents } from '@halfoneplusminus/covid-disease.sh';
import {
  ContinentsMarkers,
  ContinentsMarkersProps,
} from './continents-markers';
import CovidMap from './map';
import { Story } from '@storybook/react';

export default {
  component: ContinentsMarkers,
  title: 'Covid/ContinentsMarkers',
};

export const Api: Story<ContinentsMarkersProps> = (props) => {
  const { continents } = useStatsByContinents();

  return (
    <CovidMap zoom={3}>
      <ContinentsMarkers {...props} continents={continents} />
    </CovidMap>
  );
};
