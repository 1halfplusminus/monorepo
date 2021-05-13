import { LatLngExpression } from 'leaflet';

export class Continent {
  name: string;
  deaths: number;
  position: LatLngExpression;
}

export class Country {
  name: string;
  flag?: string;
  id?: string;
  position: LatLngExpression;
  deaths: number;
  recovered: number;
  active: number;
  cases: number;
  iso?: string;
}

export type CountryStatistics = keyof Omit<
  Country,
  'name' | 'flag' | 'id' | 'position' | 'iso'
>;

export type GetStatsByCountries = () => Promise<Country[]>;

export type GetStatsByContinent = () => Promise<Continent[]>;

export type UseStatsByCountries = () => {
  countries: Country[] | null;
  loading: boolean;
  error: boolean;
};

export type UseStatsByContinents = () => {
  continents: Continent[] | null;
  loading: boolean;
  error: boolean;
};
