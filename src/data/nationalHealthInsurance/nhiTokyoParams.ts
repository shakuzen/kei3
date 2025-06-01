import type { NationalHealthInsuranceRegionParams } from '../../types/healthInsurance';

// Example parameters for Tokyo (these are illustrative and should be verified/updated with official data)
// Based on typical values often seen for Tokyo's 23 special wards.
export const NHI_TOKYO_PARAMS: NationalHealthInsuranceRegionParams = {
  regionName: "Tokyo Special Wards (Example)",
  // Rates (e.g., 0.0771 for 7.71%)
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
