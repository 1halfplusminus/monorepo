import { latLng, latLngBounds, LatLngExpression } from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';
import { CountryStatistics } from '@halfoneplusminus/covid';

export const sortPositionnable = (
  p1: LatLngExpression,
  p2: LatLngExpression
) => {
  return latLng(p1).distanceTo([0, 0]) - latLng(p2).distanceTo([0, 0]);
};
export const mapBounds = (positionnable: { position: LatLngExpression }[]) => {
  return positionnable.length > 1
    ? latLngBounds(
        positionnable
          .map(({ position }) => position)
          .sort(sortPositionnable)
          .slice(0, positionnable.length < 5 ? positionnable.length : 5)
      )
    : latLng(positionnable[0].position).toBounds(450000);
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
  const visible = useCallback(() => {
    const zoom = map.getZoom();
    if (
      map &&
      havePositionnables(positionnables) &&
      shouldBeVisible(zoom, options)
    ) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [map, options, positionnables]);
  useMapEvent('locationfound', (e) => {
    console.log('location found', e);
    map.fitBounds(latLngBounds([e.latlng]));
  });
  useMapEvent('zoom', () => {
    visible();
  });
  useEffect(() => {
    visible();
  }, [visible]);
  useEffect(() => {
    if (map) {
      if (havePositionnables(positionnables)) {
        map.flyTo(positionnables[0].position, options.visibleAtZoomLevel[0]);
        map.setMaxZoom(options.visibleAtZoomLevel[1]);
      }
    }
  }, []);
  return { isVisible };
};

const statTypes = {
  success: '',
  warning: '',
  danger: '',
  info: '',
  secondary: '',
};

export type StatType = keyof typeof statTypes;

const isStatType = (x: string): x is StatType => {
  return x in statTypes;
};

export const getColor = (type: StatType) => {
  switch (type) {
    case 'warning':
      return '#fa9b4c';
    case 'success':
      return '#19be5e';
    case 'danger':
      return '#d1335b';
    default:
      return '#53657d';
  }
};

export const formatNumber = (number: number) =>
  new Intl.NumberFormat('fr-FR').format(number);

export const getStatType = (stat: CountryStatistics | StatType): StatType => {
  switch (stat) {
    case 'deaths':
      return 'danger';
    case 'recovered':
      return 'success';
    case 'active':
    case 'cases':
      return 'warning';
    default:
      if (isStatType(stat)) {
        return stat;
      }
      return 'info';
  }
};
