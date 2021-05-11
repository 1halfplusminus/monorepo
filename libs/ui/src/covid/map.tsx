import React, { PropsWithChildren, useEffect } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import tw from 'twin.macro';

/* eslint-disable-next-line */
export interface CovidMapProps {
  zoom?: number;
}

const StyledMapContainer = styled(MapContainer)`
  ${tw`w-full h-full`}
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
