/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { fullVaccineTimeline } from './fullVaccineTimeline';
import type { simpleVaccineTimeline } from './simpleVaccineTimeline';

export type vaccineCountryCoverage = {
    country?: string;
    timeline?: (simpleVaccineTimeline | fullVaccineTimeline);
}
