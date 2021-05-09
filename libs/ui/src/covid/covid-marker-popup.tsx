import React from 'react';
import { Popup } from 'react-leaflet';

/* eslint-disable-next-line */
export interface CovidMarkerPopupProps {
  name: string;
  deaths?: number;
  recovered?: number;
}

export function CovidMarkerPopup({
  name,
  deaths = 0,
  recovered = 0,
}: CovidMarkerPopupProps) {
  return (
    <Popup>
      name: {name}: <br />
      death: {deaths}
    </Popup>
  );
}

export default CovidMarkerPopup;
