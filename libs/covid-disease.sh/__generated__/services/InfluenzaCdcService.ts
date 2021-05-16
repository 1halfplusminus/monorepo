/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { influenzaILINet } from '../models/influenzaILINet';
import type { influenzaUSCL } from '../models/influenzaUSCL';
import type { influenzaUSPHL } from '../models/influenzaUSPHL';
import { request as __request } from '../core/request';

export class InfluenzaCdcService {

    /**
     * Get Influenza-like-illness data for the 2019 and 2020 outbreaks from the US Center for Disease Control
     * @returns influenzaILINet Status Ok
     * @throws ApiError
     */
    public static async getInfluenzaCdcService(): Promise<influenzaILINet> {
        const result = await __request({
            method: 'GET',
            path: `/v3/influenza/cdc/ILINet`,
        });
        return result.body;
    }

    /**
     * Get Influenza report data for the 2019 and 2020 outbreaks from the US Center for Disease Control, reported by US clinical labs
     * @returns influenzaUSCL Status Ok
     * @throws ApiError
     */
    public static async getInfluenzaCdcService1(): Promise<influenzaUSCL> {
        const result = await __request({
            method: 'GET',
            path: `/v3/influenza/cdc/USCL`,
        });
        return result.body;
    }

    /**
     * Get Influenza report data for the 2019 and 2020 outbreaks from the US Center for Disease Control, reported by US public health labs
     * @returns influenzaUSPHL Status Ok
     * @throws ApiError
     */
    public static async getInfluenzaCdcService2(): Promise<influenzaUSPHL> {
        const result = await __request({
            method: 'GET',
            path: `/v3/influenza/cdc/USPHL`,
        });
        return result.body;
    }

}