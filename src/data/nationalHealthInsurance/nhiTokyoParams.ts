import type { NationalHealthInsuranceRegionParams } from '../../types/healthInsurance';

// Parameters for Tokyo Special Wards under the National Health Insurance (NHI) system.
// Based on typical values often seen for Tokyo's 23 special wards.
// https://www.city.setagaya.lg.jp/02060/297.html
export const NHI_TOKYO_PARAMS: NationalHealthInsuranceRegionParams = {
  regionName: "Tokyo Special Wards",
  medicalRate: 0.0771,
  supportRate: 0.0269,
  ltcRateForEligible: 0.0225,
  // Per-capita annual amounts
  medicalPerCapita: 47300,
  supportPerCapita: 16800,
  ltcPerCapitaForEligible: 16600,
  // Annual caps for income-levied portion
  medicalCap: 660000,
  supportCap: 260000,
  ltcCapForEligible: 170000,
  // Deduction
  nhiStandardDeduction: 430000, // Often aligns with residence tax basic deduction
};
