import { pipe, mapValues, toArray, filter } from 'lodash/fp';
import { useEffect, useState } from 'react';
import { Country, GetStatsByCountries, UseStatsByCountries } from './api';

export interface CountryJSON {
  latlng: [number, number];
  name: string;
}

const mapCountry = (country: CountryJSON): Country => {
  return {
    name: country.name,
    position: country.latlng,
    deaths: 100,
    recovered: 0,
    active: 100,
    case: 0,
  };
};

export const filterCountries = pipe(
  filter((country: Country) => country.active > 0 || country.deaths > 0)
);

export const mapCountries = (countries: CountryJSON[]): Country[] =>
  pipe(mapValues(mapCountry), toArray)(countries);

export const getStatsByCountries: GetStatsByCountries = async () => {
  return (import('./__mocks__/countries.json') as Promise<unknown>).then(
    (value: CountryJSON[]) => {
      return value.map(mapCountry);
    }
  );
};

export const useStatsByCountries: UseStatsByCountries = () => {
  const [countries, setCountries] = useState<Country[] | null>(null);
  useEffect(() => {
    getStatsByCountries().then((result) => {
      setCountries(result);
    });
  }, []);
  return {
    countries: countries,
    loading: false,
    error: false,
  };
};
