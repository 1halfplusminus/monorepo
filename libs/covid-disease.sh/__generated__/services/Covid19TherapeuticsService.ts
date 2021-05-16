/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { therapeutics } from '../models/therapeutics';
import { request as __request } from '../core/request';

export class Covid19TherapeuticsService {

    /**
     * Get therapeutics trial data from RAPS (Regulatory Affairs Professional Society). Specifically published by Jeff Craven at https://www.raps.org/news-and-articles/news-articles/2020/3/covid-19-therapeutics-tracker
     * @returns therapeutics Status Ok
     * @throws ApiError
     */
    public static async getCovid19TherapeuticsService(): Promise<therapeutics> {
        const result = await __request({
            method: 'GET',
            path: `/v3/covid-19/therapeutics`,
        });
        return result.body;
    }

}