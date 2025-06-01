import type { NationalHealthInsuranceRegionParams } from '../../types/healthInsurance';
import { NHI_TOKYO_PARAMS } from './nhiTokyoParams';
// Future: import { NHI_OSAKA_PARAMS } from './nhiOsakaParams';

/**
 * A map storing National Health Insurance parameters by region key (string).
 * The region key would typically be a municipality identifier.
 */
const allNationalHealthInsuranceParams: { [regionKey: string]: NationalHealthInsuranceRegionParams } = {
  'Tokyo': NHI_TOKYO_PARAMS, // Using 'Tokyo' as a general key for this example
  // 'OsakaCity': NHI_OSAKA_PARAMS, // Example for another region
  // Add more regions/municipalities as needed
};

/**
 * Retrieves National Health Insurance parameters for a given region.
 * @param region A string identifying the region/municipality (e.g., "Tokyo", "OsakaCity").
 * @returns The NHI parameters for the region, or undefined if not found.
 */
export function getNationalHealthInsuranceParams(region: string): NationalHealthInsuranceRegionParams | undefined {
  const params = allNationalHealthInsuranceParams[region];
  if (!params) {
    console.warn(`National Health Insurance parameters not found for region: ${region}`);
  }
  return params;
}

/**
 * Exported list of available region keys for National Health Insurance.
 */
export const NATIONAL_HEALTH_INSURANCE_REGIONS = Object.keys(allNationalHealthInsuranceParams);
