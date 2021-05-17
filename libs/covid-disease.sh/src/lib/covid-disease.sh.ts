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
  GetV3Covid19Continents,
  GetV3Covid19Continents_getV3Covid19Continents,
} from './__generated__/GetV3Covid19Continents';
import { useEffect, useMemo, useState } from 'react';
import { covidHistorical } from './covidHistorical';
import { pipe } from 'fp-ts/function';
import indexBy from 'lodash/fp/indexBy';
import { format, subDays } from 'date-fns';
import { groupBy, mapValues, merge, mergeWith, toArray } from 'lodash/fp';
import { Dictionary } from 'lodash';
import { reduce } from 'fp-ts/Array';
import diffInDays from 'date-fns/differenceInCalendarDays';
import { GetV3Covid19Historical } from './__generated__/GetV3Covid19Historical';

// Set `RestLink` with your endpoint
export const restLink = new RestLink({
  uri: 'https://disease.sh/v3/covid-19',
});

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

const QUERY_HISTORY = gql`
  query GetV3Covid19Historical($lastdays: String!) {
    getV3Covid19Historical(lastdays: $lastdays)
      @rest(
        type: "[CovidHistoricalListItem]"
        path: "/historical?lastdays={args.lastdays}"
      ) {
      country
      province
      timeline {
        cases
        deaths
        recovered
      }
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
  continent: GetV3Covid19Continents_getV3Covid19Continents
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
  const { data, loading, error } = useQuery<GetV3Covid19Continents>(
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
export const calculeLastDay = (date: Date, today: Date) => {
  const diff = diffInDays(today, date) * 2;
  const mul = Math.trunc(diff / 30);
  return (mul * 30 + 30).toFixed(0);
};

export const useHistoricalData = (date: Date) => {
  const [historicalsData, setHistoricalData] = useState<
    Dictionary<covidHistorical[0]>
  >({});
  const today = useMemo(() => new Date(), []);
  const lastDay = useMemo(() => calculeLastDay(date, today), [today, date]);
  useEffect(() => {
    getHistoricalStats(lastDay).then((r) => {
      setHistoricalData(sumTimelineByCountry(r));
    });
  }, [lastDay]);
  return historicalsData;
};
const useIndexedCountries = (countries: Country[]) => {
  const indexedCountries = useMemo(
    () => indexCountriesByCountryName(countries),
    [countries]
  );
  return indexedCountries;
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

export const getHistoricalStats = async (
  lastdays: string = null
): Promise<covidHistorical> => {
  const response = await client.query<GetV3Covid19Historical>({
    query: QUERY_HISTORY,
    variables: { lastdays },
  });

  return response.data.getV3Covid19Historical;
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
    ...calculateVariation(date, timeline),
  };
};
export const calculateVariation = (
  date: Date,
  timeline: covidHistorical[0]['timeline']
) => {
  const keyToday = dateToHistoricalKey(date);
  const keyYesterday = dateToHistoricalKey(subDays(date, 1));
  return timeline.cases[keyToday]
    ? {
        today: {
          cases: timeline.cases[keyToday] - timeline.cases[keyYesterday],
          deaths: timeline.deaths[keyToday] - timeline.deaths[keyYesterday],
          recovered:
            timeline.recovered[keyToday] - timeline.recovered[keyYesterday],
        },
      }
    : null;
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
