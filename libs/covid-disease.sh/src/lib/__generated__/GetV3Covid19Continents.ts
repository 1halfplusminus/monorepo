/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetV3Covid19Continents
// ====================================================

export interface GetV3Covid19Continents_getV3Covid19Continents_continentInfo {
  __typename: "ContinentInfo";
  lat: number | null;
  long: number | null;
}

export interface GetV3Covid19Continents_getV3Covid19Continents {
  __typename: "CovidContinent";
  continent: string | null;
  continentInfo: GetV3Covid19Continents_getV3Covid19Continents_continentInfo | null;
  deaths: number | null;
  recovered: number | null;
  active: number | null;
  cases: number | null;
}

export interface GetV3Covid19Continents {
  /**
   * Get COVID-19 totals for all continents
   * 
   * Equivalent to GET /v3/covid-19/continents
   */
  getV3Covid19Continents: (GetV3Covid19Continents_getV3Covid19Continents | null)[] | null;
}
