import React from 'react';
import { Popup } from 'react-leaflet';

/* eslint-disable-next-line */
export interface CovidMarkerPopupProps {
  name: string;
  stat: number;
}

export function CovidMarkerPopup({ name, stat }: CovidMarkerPopupProps) {
  return (
    <Popup>
      name: {name}: <br />
      state: {stat}
    </Popup>
  );
}

export default CovidMarkerPopup;
