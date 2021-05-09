import React, { PropsWithChildren, useEffect } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  latLngBounds,
  LatLngBoundsExpression,
  LatLngExpression,
} from 'leaflet';

/* eslint-disable-next-line */
export interface CovidMapProps {}

const StyledMapContainer = styled(MapContainer)`
  height: 550px;
`;

export function CovidMap({ children }: PropsWithChildren<CovidMapProps>) {
  return (
    <StyledMapContainer center={[0, 0]} zoom={3} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </StyledMapContainer>
  );
}

export default CovidMap;
