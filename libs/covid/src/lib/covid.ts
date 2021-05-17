import { pipe, mapValues, toArray, filter } from 'lodash/fp';
import { useEffect, useRef, useState } from 'react';
import { Country, GetStatsByCountries, UseStatsByCountries } from './api';

export interface CountryJSON {
  latlng: [number, number];
  name: string;
  country_code: string;
  [key: string]: unknown;
}

const mapCountry = (country: CountryJSON): Country => {
  return {
    name: country.name,
    position: country.latlng,
    deaths: 100,
    recovered: 0,
    active: 100,
    cases: 0,
    iso: country.country_code || '',
    today: {
      deaths: 0,
      cases: 0,
      recovered: 0,
    },
  };
};

export const filterCountries = pipe(
  filter((country: Country) => country.active > 0 || country.deaths > 0)
);

export const mapCountries = (countries: CountryJSON[]): Country[] =>
  pipe(mapValues(mapCountry), toArray)(countries);

export const getStatsByCountries: GetStatsByCountries = async () => {
  const value = getImportJson<CountryJSON[]>(
    await import('./__mocks__/countries')
  );

  return value.map(mapCountry);
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
const getImportJson = <T>(module: { default: T } | T) => {
  return 'default' in module ? module.default : module;
};

export const filterOceaniaCountries = async () => {
  const json = getImportJson<{
    features: { properties: { iso_a2: string } }[];
  }>(await import('./oceania'));
  return (country: Country) => {
    return json.features
      .map((c) => c.properties.iso_a2.toUpperCase())
      .includes(country?.iso?.toUpperCase());
  };
};

export const useOceaniaCountriesFilter = ({
  countries,
}: {
  countries: Country[];
}) => {
  const filterRef = useRef<(country: Country) => boolean>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>();
  useEffect(() => {
    if (!filterRef.current) {
      filterOceaniaCountries().then((f) => {
        setLoaded(true);
        filterRef.current = f;
      });
    }
    if (filterRef.current) {
      setFilteredCountries(countries?.filter(filterRef.current));
    }
  }, [countries, loaded]);
  return { countries: filteredCountries, loaded };
};
