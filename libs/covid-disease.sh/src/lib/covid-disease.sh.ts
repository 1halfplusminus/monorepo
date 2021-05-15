import {
  UseStatsByContinents,
  Continent,
  Country,
  GetStatsByCountries,
  UseStatsByCountries,
  Statistics,
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
import { useEffect, useMemo, useState } from 'react';
import { Covid19JhucsseService, covidHistorical } from './__generated__';
import { pipe } from 'fp-ts/function';
import indexBy from 'lodash/fp/indexBy';
import { format } from 'date-fns';
import { groupBy, mapValues, merge, mergeWith, toArray } from 'lodash/fp';
import { Dictionary } from 'lodash';
import { reduce } from 'fp-ts/Array';

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
        flag
        iso2
      }
      deaths
      recovered
      active
      cases
      todayCases
      todayDeaths
      todayRecovered
    }
  }
`;

const QUERY_CONTINENTS = gql`
  query GetV3Covid19Continents {
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
      cases
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
    cases: country.cases,
    iso: country.countryInfo.iso2,
    today: {
      cases: country.todayCases,
      deaths: country.todayDeaths,
      recovered: country.todayRecovered,
    },
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
const useHistoricalData = (date: Date) => {
  const [historicalsData, setHistoricalData] = useState<
    Dictionary<covidHistorical[0]>
  >({});
  const [lastDay] = useState('30');
  useEffect(() => {
    getHistoricalStats(lastDay).then((r) => {
      setHistoricalData(sumTimelineByCountry(r));
    });
  }, []);
  return historicalsData;
};
const useIndexedCountries = (countries: Country[]) => {
  const historicalsData = useMemo(
    () => indexCountriesByCountryName(countries),
    [countries]
  );
  return historicalsData;
};
const useHistoricalCountries = ({
  countries,
  date,
}: {
  countries: Country[];
  date: Date;
}) => {
  const historicals = useHistoricalData(date);
  const indexedCountries = useIndexedCountries(countries);
  const historicalsCountries = useMemo(
    () =>
      pipe(
        getHistoricalStatsForDates({
          countries: indexedCountries,
          historicals,
          date,
        }),
        (v) => toArray(v)
      ),
    [indexedCountries, historicals, date]
  );
  return historicalsCountries;
};
export const useStatsByCountries: UseStatsByCountries = (
  date: Date = new Date()
) => {
  const { data, loading, error } = useQuery<GetV3Covid19Countries>(
    QUERY_CONTRIES,
    {
      client,
    }
  );
  const mappedData = useMemo(
    () => data?.getV3Covid19Countries?.map(mapCountry) || [],
    [data]
  );
  const countries = useHistoricalCountries({ countries: mappedData, date });

  return {
    countries: countries,
    loading,
    error: !error,
  };
};

export const getHistoricalStats = (lastdays: string = null) => {
  return Covid19JhucsseService.getCovid19JhucsseService3(lastdays);
};

export const getHistoricalIndex = (c: covidHistorical[0]) =>
  c.country.toLowerCase();

const mergeTimeline = (
  timelineA: covidHistorical[0]['timeline'],
  timelineB: covidHistorical[0]['timeline']
): covidHistorical[0]['timeline'] => {
  return mergeWith(
    (pa: Record<string, number>, pb: Record<string, number>) =>
      mergeWith((a: number, b: number) => (b ? a + b : a), pa, pb),
    timelineA,
    timelineB
  );
};

const sumGroupedHistorical = pipe(
  reduce([] as covidHistorical[0], (result, value: covidHistorical[0]) => {
    return {
      ...value,
      timeline: mergeTimeline(value.timeline, result.timeline),
    };
  })
);

export const sumTimelineByCountry = (
  historicals: covidHistorical | Dictionary<covidHistorical[0]>
) =>
  'length' in historicals
    ? pipe(
        historicals,
        groupBy(getHistoricalIndex),
        mapValues(sumGroupedHistorical)
      )
    : historicals;

export const indexHistoricalsByCountryName = (
  historicals: covidHistorical | Dictionary<covidHistorical[0]>
): { [key: string]: covidHistorical[0] } =>
  'length' in historicals
    ? pipe(historicals, indexBy(getHistoricalIndex))
    : historicals;

export const indexCountriesByCountryName = (
  countries: Country[] | Dictionary<Country>
) =>
  'length' in countries
    ? pipe(
        countries,
        indexBy((c) => c.name.toLowerCase())
      )
    : countries;

export const dateToHistoricalKey = (date: Date) => {
  return format(date, 'M/d/yy');
};

export const mapHistoricalToStatistique = (
  date: Date,
  timeline: covidHistorical[0]['timeline']
): Statistics => {
  const key = dateToHistoricalKey(date);
  return {
    cases: timeline.cases[key],
    deaths: timeline.deaths[key],
    recovered: timeline.recovered[key],
  };
};

export const getStatsByCountry = (date: Date) =>
  pipe(
    mapValues((v: covidHistorical[0]) =>
      mapHistoricalToStatistique(date, v.timeline)
    )
  );

export const getHistoricalStatsForDates = ({
  date,
  countries,
  historicals,
}: {
  countries: Country[] | Dictionary<Country>;
  historicals: covidHistorical | Dictionary<covidHistorical[0]>;
  date: Date;
}): { [key: string]: Country } => {
  return merge(
    indexCountriesByCountryName(countries),
    pipe(historicals, sumTimelineByCountry, getStatsByCountry(date))
  );
};
