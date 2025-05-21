/**
 * Interface for a row in the health insurance premium table.
 * - minIncomeInclusive: Minimum monthly income for this bracket (inclusive).
 * - maxIncomeExclusive: Maximum monthly income for this bracket (exclusive).
 * - halfPremiumNoLTC: Half of the health insurance premium if not applicable for Long-Term Care (LTC) insurance.
 * - halfPremiumWithLTC: Half of the health insurance premium if applicable for Long-Term Care (LTC) insurance.
 */
interface HealthInsurancePremiumTableRow {
  minIncomeInclusive: number;
  maxIncomeExclusive: number;
  halfPremiumNoLTC: number; // 折半額, 介護保険第2号被保険者に該当しない場合
  halfPremiumWithLTC: number; // 折半額, 介護保険第2号被保険者に該当する場合
}

// Health Insurance Premium Table for Tokyo Branch (effective March 2025 - Reiwa 7)
const KYOKAI_KENPO_TOKYO: HealthInsurancePremiumTableRow[] = [
  // Min Income (inclusive) | Max Income (exclusive) | Half Premium (No LTC) | Half Premium (With LTC)
  { minIncomeInclusive: 0, maxIncomeExclusive: 63000, halfPremiumNoLTC: 2873.9, halfPremiumWithLTC: 3335.0 },
  { minIncomeInclusive: 63000, maxIncomeExclusive: 73000, halfPremiumNoLTC: 3369.4, halfPremiumWithLTC: 3910.0 },
  { minIncomeInclusive: 73000, maxIncomeExclusive: 83000, halfPremiumNoLTC: 3864.9, halfPremiumWithLTC: 4485.0 },
  { minIncomeInclusive: 83000, maxIncomeExclusive: 93000, halfPremiumNoLTC: 4360.4, halfPremiumWithLTC: 5060.0 },
  { minIncomeInclusive: 93000, maxIncomeExclusive: 101000, halfPremiumNoLTC: 4855.9, halfPremiumWithLTC: 5635.0 },
  { minIncomeInclusive: 101000, maxIncomeExclusive: 107000, halfPremiumNoLTC: 5153.2, halfPremiumWithLTC: 5980.0 },
  { minIncomeInclusive: 107000, maxIncomeExclusive: 114000, halfPremiumNoLTC: 5450.5, halfPremiumWithLTC: 6325.0 },
  { minIncomeInclusive: 114000, maxIncomeExclusive: 122000, halfPremiumNoLTC: 5846.9, halfPremiumWithLTC: 6785.0 },
  { minIncomeInclusive: 122000, maxIncomeExclusive: 130000, halfPremiumNoLTC: 6243.3, halfPremiumWithLTC: 7245.0 },
  { minIncomeInclusive: 130000, maxIncomeExclusive: 138000, halfPremiumNoLTC: 6639.7, halfPremiumWithLTC: 7705.0 },
  { minIncomeInclusive: 138000, maxIncomeExclusive: 146000, halfPremiumNoLTC: 7036.1, halfPremiumWithLTC: 8165.0 },
  { minIncomeInclusive: 146000, maxIncomeExclusive: 155000, halfPremiumNoLTC: 7432.5, halfPremiumWithLTC: 8625.0 },
  { minIncomeInclusive: 155000, maxIncomeExclusive: 165000, halfPremiumNoLTC: 7928.0, halfPremiumWithLTC: 9200.0 },
  { minIncomeInclusive: 165000, maxIncomeExclusive: 175000, halfPremiumNoLTC: 8423.5, halfPremiumWithLTC: 9775.0 },
  { minIncomeInclusive: 175000, maxIncomeExclusive: 185000, halfPremiumNoLTC: 8919.0, halfPremiumWithLTC: 10350.0 },
  { minIncomeInclusive: 185000, maxIncomeExclusive: 195000, halfPremiumNoLTC: 9414.5, halfPremiumWithLTC: 10925.0 },
  { minIncomeInclusive: 195000, maxIncomeExclusive: 210000, halfPremiumNoLTC: 9910.0, halfPremiumWithLTC: 11500.0 },
  { minIncomeInclusive: 210000, maxIncomeExclusive: 230000, halfPremiumNoLTC: 10901.0, halfPremiumWithLTC: 12650.0 },
  { minIncomeInclusive: 230000, maxIncomeExclusive: 250000, halfPremiumNoLTC: 11892.0, halfPremiumWithLTC: 13800.0 },
  { minIncomeInclusive: 250000, maxIncomeExclusive: 270000, halfPremiumNoLTC: 12883.0, halfPremiumWithLTC: 14950.0 },
  { minIncomeInclusive: 270000, maxIncomeExclusive: 290000, halfPremiumNoLTC: 13874.0, halfPremiumWithLTC: 16100.0 },
  { minIncomeInclusive: 290000, maxIncomeExclusive: 310000, halfPremiumNoLTC: 14865.0, halfPremiumWithLTC: 17250.0 },
  { minIncomeInclusive: 310000, maxIncomeExclusive: 330000, halfPremiumNoLTC: 15856.0, halfPremiumWithLTC: 18400.0 },
  { minIncomeInclusive: 330000, maxIncomeExclusive: 350000, halfPremiumNoLTC: 16847.0, halfPremiumWithLTC: 19550.0 },
  { minIncomeInclusive: 350000, maxIncomeExclusive: 370000, halfPremiumNoLTC: 17838.0, halfPremiumWithLTC: 20700.0 },
  { minIncomeInclusive: 370000, maxIncomeExclusive: 395000, halfPremiumNoLTC: 18829.0, halfPremiumWithLTC: 21850.0 },
  { minIncomeInclusive: 395000, maxIncomeExclusive: 425000, halfPremiumNoLTC: 20315.5, halfPremiumWithLTC: 23575.0 },
  { minIncomeInclusive: 425000, maxIncomeExclusive: 455000, halfPremiumNoLTC: 21802.0, halfPremiumWithLTC: 25300.0 },
  { minIncomeInclusive: 455000, maxIncomeExclusive: 485000, halfPremiumNoLTC: 23288.5, halfPremiumWithLTC: 27025.0 },
  { minIncomeInclusive: 485000, maxIncomeExclusive: 515000, halfPremiumNoLTC: 24775.0, halfPremiumWithLTC: 28750.0 },
  { minIncomeInclusive: 515000, maxIncomeExclusive: 545000, halfPremiumNoLTC: 26261.5, halfPremiumWithLTC: 30475.0 },
  { minIncomeInclusive: 545000, maxIncomeExclusive: 575000, halfPremiumNoLTC: 27748.0, halfPremiumWithLTC: 32200.0 },
  { minIncomeInclusive: 575000, maxIncomeExclusive: 605000, halfPremiumNoLTC: 29234.5, halfPremiumWithLTC: 33925.0 },
  { minIncomeInclusive: 605000, maxIncomeExclusive: 635000, halfPremiumNoLTC: 30721.0, halfPremiumWithLTC: 35650.0 },
  { minIncomeInclusive: 635000, maxIncomeExclusive: 665000, halfPremiumNoLTC: 32207.5, halfPremiumWithLTC: 37375.0 },
  { minIncomeInclusive: 665000, maxIncomeExclusive: 695000, halfPremiumNoLTC: 33694.0, halfPremiumWithLTC: 39100.0 },
  { minIncomeInclusive: 695000, maxIncomeExclusive: 730000, halfPremiumNoLTC: 35180.5, halfPremiumWithLTC: 40825.0 },
  { minIncomeInclusive: 730000, maxIncomeExclusive: 770000, halfPremiumNoLTC: 37162.5, halfPremiumWithLTC: 43125.0 },
  { minIncomeInclusive: 770000, maxIncomeExclusive: 810000, halfPremiumNoLTC: 39144.5, halfPremiumWithLTC: 45425.0 },
  { minIncomeInclusive: 810000, maxIncomeExclusive: 855000, halfPremiumNoLTC: 41126.5, halfPremiumWithLTC: 47725.0 },
  { minIncomeInclusive: 855000, maxIncomeExclusive: 905000, halfPremiumNoLTC: 43604.0, halfPremiumWithLTC: 50600.0 },
  { minIncomeInclusive: 905000, maxIncomeExclusive: 955000, halfPremiumNoLTC: 46081.5, halfPremiumWithLTC: 53475.0 },
  { minIncomeInclusive: 955000, maxIncomeExclusive: 1005000, halfPremiumNoLTC: 48559.0, halfPremiumWithLTC: 56350.0 },
  { minIncomeInclusive: 1005000, maxIncomeExclusive: 1055000, halfPremiumNoLTC: 51036.5, halfPremiumWithLTC: 59225.0 },
  { minIncomeInclusive: 1055000, maxIncomeExclusive: 1115000, halfPremiumNoLTC: 54009.5, halfPremiumWithLTC: 62675.0 },
  { minIncomeInclusive: 1115000, maxIncomeExclusive: 1175000, halfPremiumNoLTC: 56982.5, halfPremiumWithLTC: 66125.0 },
  { minIncomeInclusive: 1175000, maxIncomeExclusive: 1235000, halfPremiumNoLTC: 59955.5, halfPremiumWithLTC: 69575.0 },
  { minIncomeInclusive: 1235000, maxIncomeExclusive: 1295000, halfPremiumNoLTC: 62928.5, halfPremiumWithLTC: 73025.0 },
  { minIncomeInclusive: 1295000, maxIncomeExclusive: 1355000, halfPremiumNoLTC: 65901.5, halfPremiumWithLTC: 76475.0 },
  { minIncomeInclusive: 1355000, maxIncomeExclusive: Infinity, halfPremiumNoLTC: 68874.5, halfPremiumWithLTC: 79925.0 },
];

/**
 * Calculates the monthly health insurance premium (half amount) based on monthly income
 * for Tokyo Branch, effective March 2025 (Reiwa 7).
 *
 * @param monthlyIncome The person's total monthly income (報酬月額).
 * @param includeNursingCareInsurance True if the person is a Category 2 insured
 * for long-term care insurance (介護保険第２号被保険者).
 * @returns The annual health insurance premium.
 */
export function calculateHealthInsurancePremium(
  monthlyIncome: number,
  includeNursingCareInsurance: boolean
): number {
  if (monthlyIncome < 0) {
    throw new Error('Monthly income cannot be negative.');
  }

  if (KYOKAI_KENPO_TOKYO.length === 0) {
    throw new Error('Premium table is empty. Please check the data.');
  }

  for (const row of KYOKAI_KENPO_TOKYO) {
    if (monthlyIncome >= row.minIncomeInclusive && monthlyIncome < row.maxIncomeExclusive) {
      return includeNursingCareInsurance ? Math.round(row.halfPremiumWithLTC) * 12 : Math.round(row.halfPremiumNoLTC) * 12;
    }
  }
  
  // This handles the case for the last bracket where maxIncomeExclusive is Infinity.
  // It's technically covered by the loop if monthlyIncome is very large,
  // but this explicit check can be seen as a safeguard or for clarity.
  const lastRow = KYOKAI_KENPO_TOKYO[KYOKAI_KENPO_TOKYO.length - 1];
  if (monthlyIncome >= lastRow.minIncomeInclusive && lastRow.maxIncomeExclusive === Infinity) {
     return includeNursingCareInsurance ? Math.round(lastRow.halfPremiumWithLTC) * 12 : Math.round(lastRow.halfPremiumNoLTC) * 12;
  }

  throw new Error(`Monthly income ${monthlyIncome.toLocaleString()} is outside the defined ranges in the premium table.`);
}
