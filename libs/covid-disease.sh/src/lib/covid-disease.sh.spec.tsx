import {
  useStatsByContinents,
  mapContinent,
  mapCountry,
  useStatsByCountries,
  indexHistoricalsByCountryName,
  getStatsByCountry,
  dateToHistoricalKey,
  getHistoricalStatsForDates,
  calculeLastDay,
} from './covid-disease.sh';
import { render } from '@testing-library/react';
import * as React from 'react';
import { pipe } from 'fp-ts/lib/function';
import { covidHistorical } from './covidHistorical';
import { mapValues, toArray, groupBy } from 'lodash/fp';
import { GetV3Covid19Countries_getV3Covid19Countries } from './__generated__/GetV3Covid19Countries';
import 'cross-fetch/polyfill';

describe('covidDiseaseSh', () => {
  /* global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          getV3Covid19Countries: mockCountries,
          getV3Covid19Continents: [{ continent: 'test' }],
        }),
    })
  ) as undefined;
  global.fetch = fetch as any; */
  const inputDate = new Date(2021, 3, 14);
  const mockHistorical: covidHistorical = [
    {
      country: 'Allemagne',
      timeline: {
        cases: {
          '4/14/21': 100000000,
          '4/15/21': 100000000,
        },
        deaths: {
          '4/14/21': 10000000,
          '4/15/21': 10000000,
        },
        recovered: {
          '4/14/21': 1000000,
          '4/15/21': 1000000,
        },
      },
    },
    {
      country: 'France',
      timeline: {
        cases: {
          '4/14/21': 57492,
          '4/15/21': 57534,
        },
        deaths: {
          '4/14/21': 2532,
          '4/15/21': 2533,
        },
        recovered: {
          '4/14/21': 52022,
          '4/15/21': 52083,
        },
      },
    },
    {
      country: 'France',
      timeline: {
        cases: {
          '4/14/21': 57492,
          '4/15/21': 57534,
        },
        deaths: {
          '4/14/21': 2532,
          '4/15/21': 2533,
        },
        recovered: {
          '4/14/21': 52022,
          '4/15/21': 52083,
        },
      },
    },
  ];
  const mockCountries: GetV3Covid19Countries_getV3Covid19Countries[] = [
    {
      __typename: 'CovidCountry',
      country: 'France',
      countryInfo: {
        __typename: 'CountryInfo',
        iso2: 'FR',
        lat: 46,
        long: 2,
        flag: 'https://disease.sh/assets/img/flags/fr.png',
      },
      cases: 5848154,
      todayCases: 7025,
      deaths: 107423,
      todayDeaths: 173,
      recovered: 5042584,
      todayRecovered: 43374,
      active: 698147,
    },
  ];

  const mockGetStatsByCountries = pipe(
    mockCountries,
    mapValues(mapCountry),
    toArray
  );
  const TestComponentCountries = () => {
    const { countries } = useStatsByCountries();
    return <>{countries?.map((c) => c.name)}</>;
  };
  const TestComponentContinents = () => {
    const { continents } = useStatsByContinents();
    return <>{continents?.map((c) => c.name)}</>;
  };
  it('hook useStatsByCountries should render correctly', () => {
    const { baseElement } = render(<TestComponentCountries />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
      </body>
    `);
  });
  it('hook useStatsByContinents should render correctly', () => {
    const { baseElement } = render(<TestComponentContinents />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div />
      </body>
    `);
  });

  it('map continent correctly', () => {
    expect(
      mapContinent({
        continent: 'Europe',
        deaths: 100,
        __typename: 'CovidContinent',
        continentInfo: { __typename: 'ContinentInfo', lat: 100, long: 100 },
        active: 0,
        recovered: 0,
        cases: 0,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "deaths": 100,
        "name": "Europe",
        "position": Array [
          100,
          100,
        ],
      }
    `);
  });
  it('map country correctly', () => {
    expect(
      mapCountry({
        __typename: 'CovidCountry',
        country: 'name',
        countryInfo: {
          __typename: 'CountryInfo',
          lat: 10,
          long: 10,
          iso2: 'NC',
          flag: '',
        },
        deaths: 100,
        recovered: 100,
        active: 100,
        cases: 0,
        todayCases: 10,
        todayDeaths: 10,
        todayRecovered: 10,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "active": 100,
        "cases": 0,
        "deaths": 100,
        "iso": "NC",
        "name": "name",
        "position": Array [
          10,
          10,
        ],
        "recovered": 100,
        "today": Object {
          "cases": 10,
          "deaths": 10,
          "recovered": 10,
        },
      }
    `);
  });
  it('Should create valid key for historical data from date', () => {
    expect(dateToHistoricalKey(new Date(2021, 3, 14))).toBe('4/14/21');
  });

  it('Should fetch historical data for date and merge then with countries data', async () => {
    const inputDate = new Date(2021, 3, 14);
    const indexedHistorical = pipe(indexHistoricalsByCountryName)(
      mockHistorical
    );
    const statsNotMerged = pipe(getStatsByCountry(inputDate))(
      indexedHistorical
    );

    const merged = getHistoricalStatsForDates({
      countries: mockGetStatsByCountries,
      historicals: mockHistorical,
      date: inputDate,
    });
    expect(merged['france']).not.toBe(mapCountry(mockCountries[0]));
    const { recovered, cases, deaths } = merged['france'];
    expect(merged['france'].cases).toBe(114984);
    expect({ recovered, cases, deaths }).toMatchInlineSnapshot(`
      Object {
        "cases": 114984,
        "deaths": 5064,
        "recovered": 104044,
      }
    `);
  });
  it('should calculate last day correctly', () => {
    expect(calculeLastDay(inputDate, inputDate)).toBe('30');
    expect(calculeLastDay(new Date(2021, 2, 30), inputDate)).toBe('60');
    expect(calculeLastDay(new Date(2021, 2, 14), inputDate)).toBe('90');
    expect(calculeLastDay(new Date(2021, 2, 1), inputDate)).toBe('90');
  });
});
