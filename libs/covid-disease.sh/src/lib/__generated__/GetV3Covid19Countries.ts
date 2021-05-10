/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetV3Covid19Countries
// ====================================================

export interface GetV3Covid19Countries_getV3Covid19Countries_countryInfo {
  __typename: "CountryInfo";
  lat: number | null;
  long: number | null;
}

export interface GetV3Covid19Countries_getV3Covid19Countries {
  __typename: "CovidCountry";
  country: string | null;
  countryInfo: GetV3Covid19Countries_getV3Covid19Countries_countryInfo | null;
  deaths: number | null;
  recovered: number | null;
  active: number | null;
}

export interface GetV3Covid19Countries {
  /**
   * Get COVID-19 totals for all countries
   * 
   * Equivalent to GET /v3/covid-19/countries
   */
  getV3Covid19Countries: (GetV3Covid19Countries_getV3Covid19Countries | null)[] | null;
}
