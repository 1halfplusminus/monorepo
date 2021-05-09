import {
  getStatsByCountries,
  mapCountry,
  useStatsByCountries,
} from './covid-disease.sh';
import { render } from '@testing-library/react';
import * as React from 'react';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({ getV3Covid19Countries: [{ country: 'test' }] }),
  })
) as any;

describe('covidDiseaseSh', () => {
  const TestComponent = () => {
    const { countries } = useStatsByCountries();
    return <>{countries?.map((c) => c.name)}</>;
  };
  it('render test component with ok correctly', () => {
    expect(render(<TestComponent />)).toBeTruthy();
  });
  it('map country correctly', () => {
    expect(
      mapCountry({
        __typename: 'CovidCountry',
        country: 'name',
        countryInfo: { __typename: 'CountryInfo', lat: 10, long: 10 },
        deaths: 100,
        recovered: 100,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "deaths": 100,
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
