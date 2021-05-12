import React, { FC, useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { divIcon, LatLngExpression } from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { formatNumber, getColor, StatType } from './utils';
import color from 'color';

/* eslint-disable-next-line */
export interface MarkerProps {
  position: LatLngExpression;
  value: number;
  type: StatType;
  onClick?: () => void;
}

export const CovidMarker: FC<MarkerProps> = ({
  position,
  children,
  value,
  type,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick = () => {},
}) => {
  const map = useMap();
  const eventHandlers = useMemo(
    () => ({
      click() {
        map.flyTo(position);
        onClick();
      },
    }),
    [map, position, onClick]
  );
  return (
    <Marker
      tw="h-0 w-0"
      icon={divIcon({
        html: ReactDOMServer.renderToString(
          <CircleSVG type={type} value={value} />
        ),
      })}
      eventHandlers={eventHandlers}
      position={position}
    >
      {children}
    </Marker>
  );
};

type CircleSVGProps = React.SVGProps<SVGSVGElement> & {
  value: number;
  type: StatType;
};

function CircleSVG({ value = 0, type, ...props }: CircleSVGProps) {
  const radius = useMemo(() => value?.toString().length * 10 + 20, [value]);
  const [width, height] = useMemo(() => [2 * radius, 2 * radius], [radius]);
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#prefix__filter0_d)">
        <ellipse
          cx={radius}
          cy={radius}
          rx={radius}
          ry={radius}
          fill={color(getColor(type)).alpha(0.6).toString()}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          stroke="white"
          strokeWidth="1px"
          fontSize="1.5rem"
          dy=".3em"
          fill="white"
        >
          {formatNumber(value)}
        </text>
      </g>
      <defs>
        <filter id="prefix__filter0_d" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={2} />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

export default CovidMarker;
