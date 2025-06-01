import type { EmployeesHealthInsurancePremiumTableRow, HealthInsuranceProviderId, ProviderRegion } from '../../types/healthInsurance';
import { HealthInsuranceProvider, DEFAULT_PROVIDER_REGION } from '../../types/healthInsurance'; // These are now objects
import { KYOKAI_KENPO_TOKYO_TABLE } from './kyokaiKenpoTokyoData';
import { KANTO_ITS_KENPO_TABLE } from './kantoITSKenpoData';
// Future: Import other provider data files here
// e.g., import { KYOKAI_KENPO_OSAKA_TABLE } from './kyokaiKenpoOsakaData';
// e.g., import { UNION_HEALTH_DEFAULT_TABLE } from './unionHealthData';

/**
 * A type defining the structure for storing all health insurance provider data.
 * It's a nested map: ProviderEnum -> RegionKey (string) -> PremiumTable.
 */
interface AllProviderData {
  [providerKey: string]: { // Key from HealthInsuranceProvider enum
    [regionKey: string]: EmployeesHealthInsurancePremiumTableRow[]; // Key from a region enum or a generic string like DEFAULT_PROVIDER_REGION
  };
}

export const ALL_EMPLOYEES_HEALTH_INSURANCE_DATA: AllProviderData = {
  [HealthInsuranceProvider.KYOKAI_KENPO.id]: {
    ["Tokyo"]: KYOKAI_KENPO_TOKYO_TABLE,
    // ["Osaka"]: KYOKAI_KENPO_OSAKA_TABLE, // Example for another region
  },
  [HealthInsuranceProvider.ITS_KENPO.id]: {
    [DEFAULT_PROVIDER_REGION]: KANTO_ITS_KENPO_TABLE,
  },
};

export function getHealthInsurancePremiumTable(
  provider: HealthInsuranceProviderId,
  region: ProviderRegion
): EmployeesHealthInsurancePremiumTableRow[] | undefined {
  const providerData = ALL_EMPLOYEES_HEALTH_INSURANCE_DATA[provider];
  if (!providerData) {
    console.warn(`Provider data not found for: ${provider}`);
    return undefined;
  }

  const table = providerData[region];
  if (!table) {
    console.warn(`Premium table not found for provider: ${provider}, region: ${region}`);
  }
  return table;
}