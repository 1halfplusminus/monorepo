import {
  Country,
  GetStatsByCountries,
  UseStatsByCountries,
} from '@halfoneplusminus/covid';

import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
import {
  Disease,
  Disease_getV3Covid19Countries,
} from './__generated__/Disease';

// Set `RestLink` with your endpoint
export const restLink = new RestLink({ uri: 'https://disease.sh/v3/covid-19' });

// Setup your client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

const query = gql`
  query Disease {
    getV3Covid19Countries @rest(type: "[CovidCountry]", path: "/countries") {
      country
      countryInfo {
        lat
        long
      }
    }
  }
`;

export const mapCountry = (country: Disease_getV3Covid19Countries): Country => {
  return {
    position: [country.countryInfo.lat, country.countryInfo.long],
    name: country.country,
  };
};

export const getStatsByCountries: GetStatsByCountries = () => {
  return client.query({ query }).then((response) => {
    return response.data;
  });
};

export const useStatsByCountries: UseStatsByCountries = () => {
  const { data, loading, error } = useQuery<Disease>(query, { client });
  return {
    countries: data?.getV3Covid19Countries?.map(mapCountry),
    loading,
    error: !error,
  };
};
