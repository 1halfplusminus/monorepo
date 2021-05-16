/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { covidGov } from '../models/covidGov';
import { request as __request } from '../core/request';

export class Covid19GovernmentService {

    /**
     * Get a list of supported countries for government specific data
     * Returns a list of supported country names
     * @returns covidGov Status Ok
     * @throws ApiError
     */
    public static async getCovid19GovernmentService(): Promise<covidGov> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/gov/`,
        });
        return result.body;
    }

    /**
     * Get COVID-19 government reported data for a specific country
     * @param country A valid country name from the /v3/covid-19/gov endpoint
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns any Status Ok
     * @throws ApiError
     */
    public static async getCovid19GovernmentService1(
        country: string,
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<any> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/gov/${country}`,
            query: {
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

}