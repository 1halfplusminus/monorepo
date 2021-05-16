/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type covidHistorical = Array<{
    country?: string,
    province?: string,
    /**
     * The amount of key-value pairs in 'cases', 'deaths' and 'recovered' is dependent on the 'lastdays' query
     */
    timeline?: {
        cases?: Record<string, number>,
        deaths?: Record<string, number>,
        recovered?: Record<string, number>,
    },
}>;