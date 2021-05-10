import {
  UseStatsByContinents,
  Continent,
  Country,
  filterCountries,
  GetStatsByCountries,
  UseStatsByCountries,
} from '@halfoneplusminus/covid';

import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';

import {
  GetV3Covid19Countries,
  GetV3Covid19Countries_getV3Covid19Countries,
} from './__generated__/GetV3Covid19Countries';
import {
  getV3Covid19Continents,
  getV3Covid19Continents_getV3Covid19Continents,
} from './__generated__/getV3Covid19Continents';

// Set `RestLink` with your endpoint
export const restLink = new RestLink({ uri: 'https://disease.sh/v3/covid-19' });

// Setup your client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

const QUERY_CONTRIES = gql`
  query GetV3Covid19Countries {
    getV3Covid19Countries @rest(type: "[CovidCountry]", path: "/countries") {
      country
      countryInfo {
        lat
        long
      }
      deaths
      recovered
      active
    }
  }
`;

const QUERY_CONTINENTS = gql`
  query getV3Covid19Continents {
    getV3Covid19Continents
      @rest(type: "[CovidContinent]", path: "/continents") {
      continent
      continentInfo {
        lat
        long
      }
      deaths
      recovered
      active
    }
  }
`;

export const mapCountry = (
  country: GetV3Covid19Countries_getV3Covid19Countries
): Country => {
  return {
    position: [country.countryInfo.lat, country.countryInfo.long],
    name: country.country,
    deaths: country.deaths,
    recovered: country.recovered,
    active: country.active,
  };
};

export const mapContinent = (
  continent: getV3Covid19Continents_getV3Covid19Continents
): Continent => {
  return {
    name: continent.continent,
    deaths: continent.deaths,
    position: [continent.continentInfo.lat, continent.continentInfo.long],
  };
};

export const getStatsByCountries: GetStatsByCountries = () => {
  return client.query({ query: QUERY_CONTRIES }).then((response) => {
    return response.data;
  });
};

export const useStatsByContinents: UseStatsByContinents = () => {
  const { data, loading, error } = useQuery<getV3Covid19Continents>(
    QUERY_CONTINENTS,
    {
      client,
    }
  );
  return {
    continents: data?.getV3Covid19Continents?.map(mapContinent) || [],
    loading,
    error: !error,
  };
};

export const useStatsByCountries: UseStatsByCountries = () => {
  const { data, loading, error } = useQuery<GetV3Covid19Countries>(
    QUERY_CONTRIES,
    {
      client,
    }
  );
  return {
    countries: data?.getV3Covid19Countries
      ?.filter(filterCountries)
      .map(mapCountry),
    loading,
    error: !error,
  };
};
