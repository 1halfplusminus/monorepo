/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { covidAll } from '../models/covidAll';
import type { covidContinent } from '../models/covidContinent';
import type { covidContinents } from '../models/covidContinents';
import type { covidCountries } from '../models/covidCountries';
import type { covidCountry } from '../models/covidCountry';
import type { covidState } from '../models/covidState';
import type { covidStates } from '../models/covidStates';
import { request as __request } from '../core/request';

export class Covid19WorldometersService {

    /**
     * Get global COVID-19 totals for today, yesterday and two days ago
     * @param yesterday Queries data reported a day ago
     * @param twoDaysAgo Queries data reported two days ago
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns covidAll Status OK
     * @throws ApiError
     */
    public static async getCovid19WorldometersService(
        yesterday?: any,
        twoDaysAgo?: 'true' | 'false' | '1' | '0',
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<covidAll> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/all`,
            query: {
                'yesterday': yesterday,
                'twoDaysAgo': twoDaysAgo,
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for all US States
     * @param sort Provided a key (e.g. cases, todayCases, deaths, active), result will be sorted from greatest to least
     * @param yesterday Queries data reported a day ago
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns covidStates Status OK
     * @throws ApiError
     */
    public static async getCovid19WorldometersService1(
        sort?: 'cases' | 'todayCases' | 'deaths' | 'todayDeaths' | 'active',
        yesterday?: 'true' | 'false' | '1' | '0',
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<covidStates> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/states`,
            query: {
                'sort': sort,
                'yesterday': yesterday,
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for specific US State(s)
     * @param states State name or comma separated names spelled correctly
     * @param yesterday Queries data reported a day ago
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns covidState Status OK
     * @throws ApiError
     */
    public static async getCovid19WorldometersService2(
        states: string,
        yesterday?: 'true' | 'false' | '1' | '0',
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<covidState> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/states/${states}`,
            query: {
                'yesterday': yesterday,
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for all continents
     * @param yesterday Queries data reported a day ago
     * @param twoDaysAgo Queries data reported two days ago
     * @param sort Provided a key (e.g. cases, todayCases, deaths, recovered, active), results will be sorted from greatest to least
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns covidContinents Status OK
     * @throws ApiError
     */
    public static async getCovid19WorldometersService3(
        yesterday?: 'true' | 'false' | '1' | '0',
        twoDaysAgo?: 'true' | 'false' | '1' | '0',
        sort?: 'cases' | 'todayCases' | 'deaths' | 'todayDeaths' | 'recovered' | 'active' | 'critical' | 'casesPerOneMillion' | 'deathsPerOneMillion',
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<covidContinents> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/continents`,
            query: {
                'yesterday': yesterday,
                'twoDaysAgo': twoDaysAgo,
                'sort': sort,
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for a specific continent
     * @param continent Continent name
     * @param yesterday Queries data reported a day ago
     * @param twoDaysAgo Queries data reported two days ago
     * @param strict Setting to false gives you the ability to fuzzy search continents (i.e. Oman vs. rOMANia)
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns covidContinent Status OK
     * @throws ApiError
     */
    public static async getCovid19WorldometersService4(
        continent: string,
        yesterday?: 'true' | 'false' | '1' | '0',
        twoDaysAgo?: 'true' | 'false' | '1' | '0',
        strict: 'true' | 'false' = 'true',
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<covidContinent> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/continents/${continent}`,
            query: {
                'yesterday': yesterday,
                'twoDaysAgo': twoDaysAgo,
                'strict': strict,
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for all countries
     * @param yesterday Queries data reported a day ago
     * @param twoDaysAgo Queries data reported two days ago
     * @param sort Provided a key (e.g. cases, todayCases, deaths, recovered, active), the result will be sorted from greatest to least
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns covidCountries Status OK
     * @throws ApiError
     */
    public static async getCovid19WorldometersService5(
        yesterday?: 'true' | 'false' | '1' | '0',
        twoDaysAgo?: 'true' | 'false' | '1' | '0',
        sort?: 'cases' | 'todayCases' | 'deaths' | 'todayDeaths' | 'recovered' | 'active' | 'critical' | 'casesPerOneMillion' | 'deathsPerOneMillion',
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<covidCountries> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/countries`,
            query: {
                'yesterday': yesterday,
                'twoDaysAgo': twoDaysAgo,
                'sort': sort,
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for a specific country
     * @param country A country name, iso2, iso3, or country ID code
     * @param yesterday Queries data reported a day ago
     * @param twoDaysAgo Queries data reported two days ago
     * @param strict Setting to false gives you the ability to fuzzy search countries (i.e. Oman vs. rOMANia)
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns covidCountry Status OK
     * @throws ApiError
     */
    public static async getCovid19WorldometersService6(
        country: string,
        yesterday?: 'true' | 'false' | '1' | '0',
        twoDaysAgo?: 'true' | 'false' | '1' | '0',
        strict: 'true' | 'false' = 'true',
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<covidCountry> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/countries/${country}`,
            query: {
                'yesterday': yesterday,
                'twoDaysAgo': twoDaysAgo,
                'strict': strict,
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

    /**
     * Get COVID-19 totals for a specific set of countries
     * @param countries Multiple country names, iso2, iso3, or country IDs separated by commas
     * @param yesterday Queries data reported a day ago
     * @param twoDaysAgo Queries data reported two days ago
     * @param allowNull By default, if a value is missing, it is returned as 0. This allows nulls to be returned
     * @returns covidCountries Status OK
     * @throws ApiError
     */
    public static async getCovid19WorldometersService7(
        countries: string,
        yesterday?: 'true' | 'false' | '1' | '0',
        twoDaysAgo?: 'true' | 'false' | '1' | '0',
        allowNull?: 'true' | 'false' | '1' | '0',
    ): Promise<covidCountries> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/countries/${countries}`,
            query: {
                'yesterday': yesterday,
                'twoDaysAgo': twoDaysAgo,
                'allowNull': allowNull,
            },
        });
        return result.body;
    }

}