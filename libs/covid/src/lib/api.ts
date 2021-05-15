import { LatLngExpression } from 'leaflet';

export class Continent {
  name: string;
  deaths: number;
  position: LatLngExpression;
}

export class Country implements Statistics {
  recovered: number;
  active: number;
  cases: number;
  deaths: number;
  name: string;
  flag?: string;
  id?: string;
  position: LatLngExpression;
  iso?: string;
  today: Statistics;
}

export type Statistics = {
  recovered: number;
  active?: number;
  cases: number;
  deaths: number;
};

export type StatisticsKeys = keyof Statistics;

export type GetStatsByCountries = () => Promise<Country[]>;

export type GetStatsByContinent = () => Promise<Continent[]>;

export type UseStatsByCountries = (
  date?: Date
) => {
  countries: Country[] | null;
  loading: boolean;
  error: boolean;
};

export type UseStatsByContinents = () => {
  continents: Continent[] | null;
  loading: boolean;
  error: boolean;
};
