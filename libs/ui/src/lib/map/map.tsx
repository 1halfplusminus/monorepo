import React from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Icon } from 'leaflet';
import MyMarker from './marker';


/* eslint-disable-next-line */
export interface MapProps {}

const StyledMapContainer = styled(MapContainer)`
  height: 550px;
`;
const position: [number, number] = [51.505, -0.09];

export function Map(props: MapProps) {
  return (
    <StyledMapContainer center={position} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <MyMarker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </MyMarker>
  </StyledMapContainer>
  );
}

export default Map;
