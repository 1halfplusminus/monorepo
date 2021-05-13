import React from 'react';
import { CovidMap, CovidMapProps } from './map';

export default {
  component: CovidMap,
  title: 'Covid/Map',
};

export const primary = (props: CovidMapProps) => {
  return <CovidMap {...props} />;
};
