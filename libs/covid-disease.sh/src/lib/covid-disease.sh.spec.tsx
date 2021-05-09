import { getStatsByCountries, useStatsByCountries } from './covid-disease.sh';
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
});
