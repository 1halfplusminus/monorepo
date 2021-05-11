import React from 'react';
import { CovidMap, CovidMapProps } from './map';

export default {
  component: CovidMap,
  title: 'Covid/Map',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: CovidMapProps = {};

  return <CovidMap />;
};
