/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { fullVaccineTimeline } from './fullVaccineTimeline';
import type { simpleVaccineTimeline } from './simpleVaccineTimeline';

export type vaccineStateCoverage = {
    state?: string;
    timeline?: (simpleVaccineTimeline | fullVaccineTimeline);
}
