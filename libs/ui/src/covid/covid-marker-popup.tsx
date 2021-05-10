import React from 'react';
import { Popup } from 'react-leaflet';

/* eslint-disable-next-line */
export interface CovidMarkerPopupProps {
  name: string;
  deaths?: number;
  recovered?: number;
}

export const CovidMarkerPopupContent = ({
  name,
  deaths = 0,
  recovered = 0,
}: CovidMarkerPopupProps) => {
  return (
    <>
      name: {name}: <br />
      death: {deaths}
    </>
  );
};

export function CovidMarkerPopup(props: CovidMarkerPopupProps) {
  return (
    <Popup>
      <CovidMarkerPopupContent {...props} />
    </Popup>
  );
}

export default CovidMarkerPopup;
