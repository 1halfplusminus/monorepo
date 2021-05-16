/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { covidAppleCountries } from '../models/covidAppleCountries';
import type { covidAppleData } from '../models/covidAppleData';
import type { covidAppleSubregions } from '../models/covidAppleSubregions';
import { request as __request } from '../core/request';

export class Covid19AppleService {

    /**
     * Get a list of supported countries for Apple mobility data
     * Returns a list of supported country names
     * @returns covidAppleCountries Status Ok
     * @throws ApiError
     */
    public static async getCovid19AppleService(): Promise<covidAppleCountries> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/apple/countries`,
        });
        return result.body;
    }

    /**
     * Get a list of supported subregions for specific country in the Apple mobility data set
     * Returns a list of supported subregions in a country where data is available
     * @param country A valid country name from the /v3/covid-19/apple/countries endpoint
     * @returns covidAppleSubregions Status Ok
     * @throws ApiError
     */
    public static async getCovid19AppleService1(
        country: string,
    ): Promise<covidAppleSubregions> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/apple/countries/${country}`,
        });
        return result.body;
    }

    /**
     * Get COVID-19 Apple mobility data for subregions of a country
     * Returns a list of mobility data entries for subregion(s) every day since January 13th. Each entry has driving, transit, and walking data with an associated number of percentage change since January 13th
     * @param country A valid country name from the /v3/covid-19/apple/countries endpoint
     * @param subregions Valid subregion(s) from the /v3/covid-19/apple/countries/{country} endpoint, separated by with commas
     * @returns covidAppleData Status Ok
     * @throws ApiError
     */
    public static async getCovid19AppleService2(
        country: string,
        subregions: string,
    ): Promise<covidAppleData> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/apple/countries/${country}/${subregions}`,
        });
        return result.body;
    }

}