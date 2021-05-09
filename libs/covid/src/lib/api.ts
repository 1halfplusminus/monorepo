import { LatLngExpression } from 'leaflet';

export class Country {
  name: string;
  flag?: string;
  id?: string;
  position: LatLngExpression;
}

export type GetStatsByCountries = () => Promise<Country[]>;

export type UseStatsByCountries = () => {
  countries: Country[] | null;
  loading: boolean;
  error: boolean;
};
