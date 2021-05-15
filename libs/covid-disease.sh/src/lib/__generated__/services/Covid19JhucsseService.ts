/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { covidHistorical } from '../models/covidHistorical';
import type { covidHistoricalAll } from '../models/covidHistoricalAll';
import type { covidHistoricalCountries } from '../models/covidHistoricalCountries';
import type { covidHistoricalCountry } from '../models/covidHistoricalCountry';
import type { covidHistoricalProvince } from '../models/covidHistoricalProvince';
import type { covidHistoricalProvinces } from '../models/covidHistoricalProvinces';
import type { covidHistoricalUSCounties } from '../models/covidHistoricalUSCounties';
import type { covidHistoricalUSCounty } from '../models/covidHistoricalUSCounty';
import type { covidJHUCounties } from '../models/covidJHUCounties';
import type { covidJHUCountries } from '../models/covidJHUCountries';
import { request as __request } from '../core/request';

export class Covid19JhucsseService {

    /**
     * Get COVID-19 totals for all countries and their provinces
     * @returns covidJHUCountries Status OK
     * @throws ApiError
     */
    public static async getCovid19JhucsseService(): Promise<covidJHUCountries> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/jhucsse`,
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for all US counties
     * @returns covidJHUCounties Status OK
     * @throws ApiError
     */
    public static async getCovid19JhucsseService1(): Promise<covidJHUCounties> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/jhucsse/counties`,
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for a specific county
     * @param county Name of any county in the USA. All counties are listed in the /v3/covid-19/jhucsse/counties/ endpoint
     * @returns covidJHUCounties Status OK
     * @throws ApiError
     */
    public static async getCovid19JhucsseService2(
        county: string,
    ): Promise<covidJHUCounties> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/jhucsse/counties/${county}`,
        });
        return result.body;
    }

    /**
     * Get COVID-19 time series data for all countries and their provinces
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @returns covidHistorical Status OK
     * @throws ApiError
     */
    public static async getCovid19JhucsseService3(
        lastdays: string = '30',
    ): Promise<covidHistorical> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/historical`,
            query: {
                'lastdays': lastdays,
            },
        });
        return result.body;
    }

    /**
     * Get global accumulated COVID-19 time series data
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @returns covidHistoricalAll Status Ok
     * @throws ApiError
     */
    public static async getCovid19JhucsseService4(
        lastdays: string = '30',
    ): Promise<covidHistoricalAll> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/historical/all`,
            query: {
                'lastdays': lastdays,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 time series data for a specific country
     * @param country A country name, iso2, iso3, or country ID code
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @returns covidHistoricalCountry Status Ok
     * @throws ApiError
     */
    public static async getCovid19JhucsseService5(
        country: string,
        lastdays: string = '30',
    ): Promise<covidHistoricalCountry> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/historical/${country}`,
            query: {
                'lastdays': lastdays,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 time series data for a specific set of countries
     * @param countries Multiple country names, iso2, iso3, or country IDs separated by commas
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @returns covidHistoricalCountries Status Ok
     * @throws ApiError
     */
    public static async getCovid19JhucsseService6(
        countries: string,
        lastdays: string = '30',
    ): Promise<covidHistoricalCountries> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/historical/${countries}`,
            query: {
                'lastdays': lastdays,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 time series data for a specific province in a country
     * @param country A country name, iso2, iso3, or country ID code
     * @param province Province name. All available names can be found in the /v3/covid-19/historical/{query} endpoint
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @returns covidHistoricalProvince Status Ok
     * @throws ApiError
     */
    public static async getCovid19JhucsseService7(
        country: string,
        province: string,
        lastdays: string = '30',
    ): Promise<covidHistoricalProvince> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/historical/${country}/${province}`,
            query: {
                'lastdays': lastdays,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 time series data for a set of provinces in a country
     * @param country A country name, iso2, iso3, or country ID code
     * @param provinces Provinces spelled correctly separated by ',' or '|' delimiters, never both in the same query
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @returns covidHistoricalProvinces Status Ok
     * @throws ApiError
     */
    public static async getCovid19JhucsseService8(
        country: string,
        provinces: string,
        lastdays: string = '30',
    ): Promise<covidHistoricalProvinces> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/historical/${country}/${provinces}`,
            query: {
                'lastdays': lastdays,
            },
        });
        return result.body;
    }

    /**
     * Get all possible US States to query the /historical/usacounties/{state} endpoint with
     * Returns a list of US States and provinces
     * @returns covidHistoricalUSCounties Status OK
     * @throws ApiError
     */
    public static async getCovid19JhucsseService9(): Promise<covidHistoricalUSCounties> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/historical/usacounties`,
        });
        return result.body;
    }

    /**
     * Get COVID-19 time series data for all counties in a specified US state
     * @param state US state name, validated in the array returned from the /v3/covid-19/historical/usacounties endpoint
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @returns covidHistoricalUSCounty Status Ok
     * @throws ApiError
     */
    public static async getCovid19JhucsseService10(
        state: string,
        lastdays: string = '30',
    ): Promise<covidHistoricalUSCounty> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/historical/usacounties/${state}`,
            query: {
                'lastdays': lastdays,
            },
        });
        return result.body;
    }

}