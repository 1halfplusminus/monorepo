import { LatLngExpression, latLng, latLngBounds } from 'leaflet';
import { useState, useEffect } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';

export const sortPositionnable = (
  p1: LatLngExpression,
  p2: LatLngExpression
) => {
  return latLng(p1).distanceTo([0, 0]) - latLng(p2).distanceTo([0, 0]);
};
export const mapBounds = (positionnable: { position: LatLngExpression }[]) => {
  return latLngBounds(
    positionnable
      .map(({ position }) => position)
      .sort(sortPositionnable)
      .slice(0, 5)
  );
};
const havePositionnables = (positionnables: { position: LatLngExpression }[]) =>
  positionnables && positionnables.length > 0;

const shouldBeVisible = (
  zoom: number,
  options: { visibleAtZoomLevel?: [number, number] } = {}
) =>
  !options?.visibleAtZoomLevel
    ? true
    : zoom >= options.visibleAtZoomLevel[0] &&
      zoom <= options.visibleAtZoomLevel[1];

export const useFitBounds = (
  positionnables: { position: LatLngExpression }[],
  options: { visibleAtZoomLevel?: [number, number] } = {}
) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState(true);
  // const visible = useCallback(() => {
  //   const zoom = map.getZoom();
  //   if (
  //     map &&
  //     havePositionnables(positionnables) &&
  //     shouldBeVisible(zoom, options)
  //   ) {
  //     setIsVisible(true);
  //   } else {
  //     setIsVisible(false);
  //   }
  // }, [map, options, positionnables]);
  useMapEvent('locationfound', (e) => {
    console.log('location found', e);
    map.fitBounds(latLngBounds([e.latlng]));
  });
  // useMapEvent('zoom', () => {
  //   visible();
  // });
  // useEffect(() => {
  //   visible();
  // }, [visible]);
  useEffect(() => {
    if (map) {
      if (havePositionnables(positionnables)) {
        map.flyTo(
          mapBounds(positionnables).getCenter(),
          options.visibleAtZoomLevel[0]
        );
        map.setMaxZoom(options.visibleAtZoomLevel[1]);
      }
    }
  }, [positionnables.length]);
  return { isVisible };
};
