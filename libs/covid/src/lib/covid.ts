import { pipe, mapValues, toArray } from 'lodash/fp';
import { useEffect, useState } from 'react';
import { Country, GetStatsByCountries, UseStatsByCountries } from './api';
import countries from './countries.json';
export interface CountryJSON {
  latlng: [number, number];
  name: string;
}

const mapCountry = (country: CountryJSON): Country => {
  return {
    name: country.name,
    position: country.latlng,
    deaths: 0,
    recovered: 0,
  };
};

export const mapCountries = (countries: CountryJSON[]): Country[] =>
  pipe(mapValues(mapCountry), toArray)(countries);

export const getStatsByCountries: GetStatsByCountries = async () => {
  return countries;
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
