import React, { FC } from 'react';
import { Marker } from 'react-leaflet';
import svg from './marker.svg';
import { Icon, LatLngExpression } from 'leaflet';

/* eslint-disable-next-line */
export interface MarkerProps {
  position: LatLngExpression;
  size?: number;
}

export const CovidMarker: FC<MarkerProps> = ({
  position,
  children,
  size = 50,
}) => {
  return (
    <Marker
      icon={new Icon({ iconUrl: svg, iconSize: [size, size] })}
      position={position}
    >
      {children}
    </Marker>
  );
};

export default CovidMarker;
