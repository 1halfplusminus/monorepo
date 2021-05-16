/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type covidHistoricalUSCounty = Array<{
    province?: string,
    county?: string,
    /**
     * The amount of key-value pairs in 'cases', 'deaths' and 'recovered' is dependent on the 'lastdays' query
     */
    timeline?: {
        cases?: {
            date?: number,
        },
        deaths?: {
            date?: number,
        },
        recovered?: {
            date?: number,
        },
    },
}>;