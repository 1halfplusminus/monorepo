import React, { FC } from 'react';

import styled from 'styled-components';
import {  Marker, Popup } from 'react-leaflet'
import svg from "./Map_marker.svg";
import { Icon , LatLngExpression } from 'leaflet';

/* eslint-disable-next-line */
export interface MarkerProps {
  position: LatLngExpression
  size?: number
}

const StyledMarker = styled.div`
  color: pink;
`;

export const MyMarker: FC<MarkerProps> = ({position, children, size = 50}) => {
  return (
    <Marker icon={new Icon({iconUrl: svg,iconSize:[size,size]})} position={position}>
      {children}
    </Marker>
  );
}

export default MyMarker;
