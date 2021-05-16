/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { vaccineCountriesCoverage } from '../models/vaccineCountriesCoverage';
import type { vaccineCountryCoverage } from '../models/vaccineCountryCoverage';
import type { vaccineCoverage } from '../models/vaccineCoverage';
import type { vaccines } from '../models/vaccines';
import type { vaccineStateCoverage } from '../models/vaccineStateCoverage';
import type { vaccineStatesCoverage } from '../models/vaccineStatesCoverage';
import { request as __request } from '../core/request';

export class Covid19VaccineService {

    /**
     * Get vaccine trial data from RAPS (Regulatory Affairs Professional Society). Specifically published by Jeff Craven at https://www.raps.org/news-and-articles/news-articles/2020/3/covid-19-vaccine-tracker
     * @returns vaccines Status Ok
     * @throws ApiError
     */
    public static async getCovid19VaccineService(): Promise<vaccines> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/vaccine`,
        });
        return result.body;
    }

    /**
     * Get total global COVID-19 vaccine doses administered. Sourced from https://covid.ourworldindata.org/
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @param fullData Flag indicating whether to return data type as simpleVaccineTimeline (false) or fullVaccineTimeline (true).
     * @returns vaccineCoverage Status Ok
     * @throws ApiError
     */
    public static async getCovid19VaccineService1(
        lastdays: string = '30',
        fullData: string = 'false',
    ): Promise<vaccineCoverage> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/vaccine/coverage`,
            query: {
                'lastdays': lastdays,
                'fullData': fullData,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 vaccine doses administered for all countries that have reported rolling out vaccination. Sourced  from https://covid.ourworldindata.org/
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @param fullData Flag indicating whether to return timeline data type as simpleVaccineTimeline (false) or fullVaccineTimeline (true).
     * @returns vaccineCountriesCoverage Status Ok
     * @throws ApiError
     */
    public static async getCovid19VaccineService2(
        lastdays: string = '30',
        fullData: string = 'false',
    ): Promise<vaccineCountriesCoverage> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/vaccine/coverage/countries`,
            query: {
                'lastdays': lastdays,
                'fullData': fullData,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 vaccine doses administered for a country that has reported vaccination rollout. Sourced from https://covid.ourworldindata.org/
     * @param country A valid country name, iso2, iso3
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @param fullData Flag indicating whether to return timeline data type as simpleVaccineTimeline (false) or fullVaccineTimeline (true).
     * @returns vaccineCountryCoverage Status Ok
     * @throws ApiError
     */
    public static async getCovid19VaccineService3(
        country: string,
        lastdays: string = '30',
        fullData: string = 'false',
    ): Promise<vaccineCountryCoverage> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/vaccine/coverage/countries/${country}`,
            query: {
                'lastdays': lastdays,
                'fullData': fullData,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 vaccine doses administered for all states that have reported rolling out vaccination. Sourced  from https://covid.ourworldindata.org/
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @param fullData Flag indicating whether to return timeline data type as simpleVaccineTimeline (false) or fullVaccineTimeline (true).
     * @returns vaccineStatesCoverage Status Ok
     * @throws ApiError
     */
    public static async getCovid19VaccineService4(
        lastdays: string = '30',
        fullData: string = 'false',
    ): Promise<vaccineStatesCoverage> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/vaccine/coverage/states`,
            query: {
                'lastdays': lastdays,
                'fullData': fullData,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 vaccine doses administered for a state that has reported vaccination rollout. Sourced from https://covid.ourworldindata.org/
     * @param state A valid state name
     * @param lastdays Number of days to return. Use 'all' for the full data set (e.g. 15, all, 24)
     * @param fullData Flag indicating whether to return timeline data type as simpleVaccineTimeline (false) or fullVaccineTimeline (true).
     * @returns vaccineStateCoverage Status Ok
     * @throws ApiError
     */
    public static async getCovid19VaccineService5(
        state: string,
        lastdays: string = '30',
        fullData: string = 'false',
    ): Promise<vaccineStateCoverage> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/vaccine/coverage/states/${state}`,
            query: {
                'lastdays': lastdays,
                'fullData': fullData,
            },
        });
        return result.body;
    }

}