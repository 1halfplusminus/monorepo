import React, { PropsWithChildren, useEffect } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/* eslint-disable-next-line */
export interface CovidMapProps {
  zoom?: number;
}

const StyledMapContainer = styled(MapContainer)`
  height: 550px;
`;

export function CovidMap({
  children,
  zoom = 4,
}: PropsWithChildren<CovidMapProps>) {
  return (
    <StyledMapContainer center={[0, 0]} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </StyledMapContainer>
  );
}

export default CovidMap;
