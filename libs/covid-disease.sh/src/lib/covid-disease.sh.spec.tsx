import {
  useStatsByContinents,
  mapContinent,
  mapCountry,
  useStatsByCountries,
} from './covid-disease.sh';
import { render } from '@testing-library/react';
import * as React from 'react';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        getV3Covid19Countries: [{ country: 'test' }],
        getV3Covid19Continents: [{ continent: 'test' }],
      }),
  })
) as undefined;

describe('covidDiseaseSh', () => {
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
      }
    `);
  });
});
