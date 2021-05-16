/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetV3Covid19Historical
// ====================================================

export interface GetV3Covid19Historical_getV3Covid19Historical_timeline {
  __typename: "Timeline";
  cases: any | null;
  deaths: any | null;
  recovered: any | null;
}

export interface GetV3Covid19Historical_getV3Covid19Historical {
  __typename: "CovidHistoricalListItem";
  country: string | null;
  province: string | null;
  /**
   * The amount of key-value pairs in 'cases', 'deaths' and 'recovered' is dependent on the 'lastdays' query
   */
  timeline: GetV3Covid19Historical_getV3Covid19Historical_timeline | null;
}

export interface GetV3Covid19Historical {
  /**
   * Get COVID-19 time series data for all countries and their provinces
   * 
   * Equivalent to GET /v3/covid-19/historical
   */
  getV3Covid19Historical: (GetV3Covid19Historical_getV3Covid19Historical | null)[] | null;
}
