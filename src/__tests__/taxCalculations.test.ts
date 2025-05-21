import { describe, it, expect } from 'vitest'
import { calculateTaxes, getEmploymentIncomeDeduction, calculateHealthInsurance, calculatePensionPayments, calculateEmploymentInsurance, calculateNationalIncomeTaxBasicDeduction, calculateNationalIncomeTax, calculateResidenceTaxBasicDeduction, calculateResidenceTax } from '../utils/taxCalculations'

describe('calculateHealthInsurance', () => {
  it('calculates base health insurance for people under 40', () => {
    // Base rate 9.91%, employee pays 50%
    expect(calculateHealthInsurance(5_000_000, false)).toBe(247_750) // (5M * 9.91% / 2)
    expect(calculateHealthInsurance(20_000_000, false)).toBe(826_494) // Capped at 68,874.5 * 12
  })

  it('calculates health insurance with nursing care for people over 40', () => {
    // Base rate 9.91% + nursing care 1.59%, employee pays 50%
    expect(calculateHealthInsurance(5_000_000, true)).toBe(287_500) // (5M * (9.91% + 1.59%) / 2)
    expect(calculateHealthInsurance(20_000_000, true)).toBe(959_100) // Capped at 79,925 * 12
  })

  it('handles zero income correctly', () => {
    expect(calculateHealthInsurance(0, false)).toBe(0)
    expect(calculateHealthInsurance(0, true)).toBe(0)
  })

  it('handles negative income correctly', () => {
    expect(calculateHealthInsurance(-1_000_000, false)).toBe(-49_550) // (-1M * 9.91% / 2)
    expect(calculateHealthInsurance(-1_000_000, true)).toBe(-57_500) // (-1M * (9.91% + 1.59%) / 2)
  })
})

describe('getEmploymentIncomeDeduction', () => {
  it('returns 550,000 yen for income up to 1,625,000 yen', () => {
    expect(getEmploymentIncomeDeduction(1_500_000)).toBe(550_000)
    expect(getEmploymentIncomeDeduction(1_625_000)).toBe(550_000)
  })

  it('calculates deduction correctly for income between 1,625,001 and 1,800,000 yen', () => {
    expect(getEmploymentIncomeDeduction(1_700_000)).toBe(1_700_000 * 0.4 - 100_000)
  })

  it('calculates deduction correctly for income between 1,800,001 and 3,600,000 yen', () => {
    expect(getEmploymentIncomeDeduction(2_500_000)).toBe(2_500_000 * 0.3 + 80_000)
  })

  it('calculates deduction correctly for income between 3,600,001 and 6,600,000 yen', () => {
    expect(getEmploymentIncomeDeduction(5_000_000)).toBe(5_000_000 * 0.2 + 440_000)
  })

  it('calculates deduction correctly for income between 6,600,001 and 8,500,000 yen', () => {
    expect(getEmploymentIncomeDeduction(7_500_000)).toBe(7_500_000 * 0.1 + 1_100_000)
  })

  it('returns maximum deduction of 1,950,000 yen for income above 8,500,000 yen', () => {
    expect(getEmploymentIncomeDeduction(9_000_000)).toBe(1_950_000)
    expect(getEmploymentIncomeDeduction(10_000_000)).toBe(1_950_000)
  })
})

describe('calculateTaxes', () => {
  // Test cases for different income brackets
  it('calculates taxes correctly for income below 1,950,000 yen', () => {
    const result = calculateTaxes(1_500_000, true, false)
    expect(result.nationalIncomeTax).toBe(12_700) // 1.5M - 1.95M (employment deduction) - 0.8M (social insurance) - 480K (basic deduction) = 0, then 5% + 2.1% rounded down
    expect(result.residenceTax).toBe(35_000) // (1.5M - 0.8M - 430K) = 270K, then 6% city tax + 4% prefectural tax + 5K 均等割, all rounded down
    expect(result.healthInsurance).toBe(74_325) // 1.5M * 9.91% / 2 = 74,325
    expect(result.pensionPayments).toBe(137_250) // 1.5M * 9.15% = 137,250
    expect(result.employmentInsurance).toBe(8_250) // 1.5M * 0.55% = 8,250
    expect(result.totalTax).toBe(267_525) // 12,700 + 35,000 + 74,325 + 137,250 + 8,250
    expect(result.takeHomeIncome).toBe(1_232_475)
  })

  it('calculates taxes correctly for income between 1,950,000 and 3,300,000 yen', () => {
    const result = calculateTaxes(2_500_000, true, false)
    expect(result.nationalIncomeTax).toBe(42_000) // 2.5M - 830K (employment deduction) - 366.375K (social insurance) - 480K (basic deduction) = 823.625K, rounded to 823K, then 5% = 41.15K, + 2.1% = 42.014K, rounded down to 42K
    expect(result.residenceTax).toBe(92_200) // (2.5M - 830K - 366.375K - 430K) = 873.625K, rounded to 873K, then 6% city tax (52.3K) + 4% prefectural tax (34.9K) + 5K 均等割
    expect(result.healthInsurance).toBe(123_875) // 2.5M * 9.91% / 2 = 123,875
    expect(result.pensionPayments).toBe(228_750) // 2.5M * 9.15% = 228,750
    expect(result.employmentInsurance).toBe(13_750) // 2.5M * 0.55% = 13,750
    expect(result.totalTax).toBe(500_575) // 42,000 + 92,200 + 123,875 + 228,750 + 13,750
    expect(result.takeHomeIncome).toBe(1_999_425)
  })

  it('calculates taxes correctly for income between 3,300,000 and 6,950,000 yen', () => {
    const result = calculateTaxes(5_000_000, true, false)
    expect(result.nationalIncomeTax).toBe(140_000) // 5M - 1.44M (employment deduction) - 732.75K (social insurance) - 480K (basic deduction) = 2.34725M, rounded to 2.347M, then 10% - 97.5K = 137.2K, + 2.1% = 140.081K, rounded down to 140K
    expect(result.residenceTax).toBe(244_600) // (5M - 1.44M - 732.75K - 430K) = 2.39725M, rounded to 2.397M, then 6% city tax (143.8K) + 4% prefectural tax (95.8K) + 5K 均等割
    expect(result.healthInsurance).toBe(247_750) // 5M * 9.91% / 2 = 247,750
    expect(result.pensionPayments).toBe(457_500) // 5M * 9.15% = 457,500
    expect(result.employmentInsurance).toBe(27_500) // 5M * 0.55% = 27,500
    expect(result.totalTax).toBe(1_117_350) // 140,000 + 244,600 + 247,750 + 457,500 + 27,500
    expect(result.takeHomeIncome).toBe(3_882_650)
  })

  // Test cases for age-related calculations
  it('calculates higher health insurance for people over 40', () => {
    const result = calculateTaxes(5_000_000, true, true)
    expect(result.healthInsurance).toBe(287_500) // 5M * (9.91% + 1.59%) / 2 = 287,500
    expect(result.employmentInsurance).toBe(27_500) // 5M * 0.55% = 27,500
  })

  // Test cases for maximum caps
  it('respects maximum caps for health insurance and pension', () => {
    const result = calculateTaxes(20_000_000, true, false)
    expect(result.healthInsurance).toBe(826_494) // Capped at 68,874.5 * 12
    expect(result.pensionPayments).toBe(713_700) // Capped at 59,475 * 12
    expect(result.employmentInsurance).toBe(110_000) // 20M * 0.55% = 110,000
  })

  // Test cases for high income brackets
  it('calculates taxes correctly for income above 40,000,000 yen', () => {
    const result = calculateTaxes(50_000_000, true, false)
    expect(result.nationalIncomeTax).toBe(16_345_400) // 50M - 1.95M (employment deduction) - 1.815194M (social insurance) - 0 (basic deduction) = 46.234806M, rounded to 46.234M, then 45% - 4.796M = 16.0093M, + 2.1% = 16.345495M, rounded down to 16.3454M
    expect(result.residenceTax).toBe(4_628_300) // (50M - 1.95M - 1.815194M - 0) = 46.234806M, rounded to 46.234M, then 6% city tax (2.774M) + 4% prefectural tax (1.8493M) + 5K 均等割
    expect(result.healthInsurance).toBe(826_494) // Capped at 68,874.5 * 12
    expect(result.pensionPayments).toBe(713_700) // Capped at 59,475 * 12
    expect(result.employmentInsurance).toBe(275_000) // 50M * 0.55% = 275,000
    expect(result.totalTax).toBe(22_788_894) // 16,345,400 + 4,628,300 + 826,494 + 713,700 + 275,000
    expect(result.takeHomeIncome).toBe(27_211_106)
  })

  // Test edge cases
  it('handles zero income correctly', () => {
    const result = calculateTaxes(0, true, false)
    expect(result.nationalIncomeTax).toBe(0)
    expect(result.residenceTax).toBe(0)
    expect(result.healthInsurance).toBe(0)
    expect(result.pensionPayments).toBe(0)
    expect(result.employmentInsurance).toBe(0)
    expect(result.totalTax).toBe(0)
    expect(result.takeHomeIncome).toBe(0)
  })

  it('handles negative income correctly', () => {
    const result = calculateTaxes(-1_000_000, true, false)
    expect(result.nationalIncomeTax).toBe(0)
    expect(result.residenceTax).toBe(0)
    expect(result.healthInsurance).toBe(0)
    expect(result.pensionPayments).toBe(0)
    expect(result.employmentInsurance).toBe(0)
    expect(result.totalTax).toBe(0)
    expect(result.takeHomeIncome).toBe(0)
  })

  it('calculates taxes correctly for non-employment income', () => {
    const result = calculateTaxes(5_000_000, false, false)
    expect(result.nationalIncomeTax).toBe(392_900) // 5M - 457.87K (social insurance) - 480K (basic deduction) = 4.06213M, rounded to 4.062M, then 20% - 427.5K = 384.9K, + 2.1% = 392.983K, rounded down to 392.9K
    expect(result.residenceTax).toBe(416_100) // (5M - 457.87K - 430K) = 4.11213M, rounded to 4.112M, then 6% city tax (246.7K) + 4% prefectural tax (164.4K) + 5K 均等割
    expect(result.healthInsurance).toBe(247_750) // 5M * 9.91% / 2 = 247,750
    expect(result.pensionPayments).toBe(210_120) // Fixed national pension (17,510 * 12)
    expect(result.employmentInsurance).toBe(0) // No employment insurance for non-employment income
    expect(result.totalTax).toBe(1_266_870) // 392,900 + 416,100 + 247,750 + 210,120 + 0
    expect(result.takeHomeIncome).toBe(3_733_130)
  })
})

describe('calculatePensionPayments', () => {
  it('calculates employees pension correctly for employment income below cap', () => {
    expect(calculatePensionPayments(5_000_000, true)).toBe(457_500) // 9.15% of 5M
  })

  it('respects maximum cap for high employment income', () => {
    expect(calculatePensionPayments(10_000_000, true)).toBe(713_700) // Capped at 59,475 * 12
  })

  it('calculates fixed national pension for non-employment income', () => {
    expect(calculatePensionPayments(5_000_000, false)).toBe(210_120) // 17,510 * 12 months
    expect(calculatePensionPayments(10_000_000, false)).toBe(210_120) // Same fixed amount regardless of income
  })

  it('handles zero income correctly', () => {
    expect(calculatePensionPayments(0, true)).toBe(0)
    expect(calculatePensionPayments(0, false)).toBe(210_120) // Still pays fixed amount
  })

  it('handles negative income correctly', () => {
    expect(calculatePensionPayments(-1_000_000, true)).toBe(-91_500) // 9.15% of -1M
    expect(calculatePensionPayments(-1_000_000, false)).toBe(210_120) // Still pays fixed amount
  })
})

describe('calculateEmploymentInsurance', () => {
  it('calculates employment insurance correctly for employment income', () => {
    expect(calculateEmploymentInsurance(5_000_000, true)).toBe(27_500) // 0.55% of 5M
    expect(calculateEmploymentInsurance(10_000_000, true)).toBe(55_000) // 0.55% of 10M
  })

  it('returns zero for non-employment income', () => {
    expect(calculateEmploymentInsurance(5_000_000, false)).toBe(0)
    expect(calculateEmploymentInsurance(10_000_000, false)).toBe(0)
  })

  it('handles zero income correctly', () => {
    expect(calculateEmploymentInsurance(0, true)).toBe(0)
    expect(calculateEmploymentInsurance(0, false)).toBe(0)
  })

  it('handles negative income correctly', () => {
    expect(calculateEmploymentInsurance(-1_000_000, true)).toBe(0)
    expect(calculateEmploymentInsurance(-1_000_000, false)).toBe(0)
  })
})

describe('calculateNationalIncomeTaxBasicDeduction', () => {
  it('returns 480,000 yen for income up to 24,000,000 yen', () => {
    expect(calculateNationalIncomeTaxBasicDeduction(0)).toBe(480_000)
    expect(calculateNationalIncomeTaxBasicDeduction(10_000_000)).toBe(480_000)
    expect(calculateNationalIncomeTaxBasicDeduction(24_000_000)).toBe(480_000)
  })

  it('returns 320,000 yen for income between 24,000,001 and 24,500,000 yen', () => {
    expect(calculateNationalIncomeTaxBasicDeduction(24_000_001)).toBe(320_000)
    expect(calculateNationalIncomeTaxBasicDeduction(24_500_000)).toBe(320_000)
  })

  it('returns 160,000 yen for income between 24,500,001 and 25,000,000 yen', () => {
    expect(calculateNationalIncomeTaxBasicDeduction(24_500_001)).toBe(160_000)
    expect(calculateNationalIncomeTaxBasicDeduction(25_000_000)).toBe(160_000)
  })

  it('returns 0 yen for income above 25,000,000 yen', () => {
    expect(calculateNationalIncomeTaxBasicDeduction(25_000_001)).toBe(0)
    expect(calculateNationalIncomeTaxBasicDeduction(30_000_000)).toBe(0)
  })

  it('handles negative income correctly', () => {
    expect(calculateNationalIncomeTaxBasicDeduction(-1_000_000)).toBe(480_000)
  })
})

describe('calculateNationalIncomeTax', () => {
  it('calculates tax correctly for income below 1,950,000 yen', () => {
    expect(calculateNationalIncomeTax(1_500_000)).toBe(76_500) // 1.5M * 5% = 75K, + 2.1% = 76.575K, rounded down to 76.5K
    expect(calculateNationalIncomeTax(1_949_000)).toBe(99_400) // 1.949M * 5% = 97.45K, + 2.1% = 99.497K, rounded down to 99.4K
  })

  it('calculates tax correctly for income between 1,950,000 and 3,300,000 yen', () => {
    expect(calculateNationalIncomeTax(1_950_000)).toBe(99_500) // 1.95M * 10% - 97.5K = 97.5K, + 2.1% = 99.548K, rounded down to 99.5K
    expect(calculateNationalIncomeTax(3_299_000)).toBe(237_200) // 3.299M * 10% - 97.5K = 232.4K, + 2.1% = 237.280K, rounded down to 237.2K
  })

  it('calculates tax correctly for income between 3,300,000 and 6,950,000 yen', () => {
    expect(calculateNationalIncomeTax(3_300_000)).toBe(237_300) // 3.3M * 20% - 427.5K = 232.5K, + 2.1% = 237.383K, rounded down to 237.3K
    expect(calculateNationalIncomeTax(6_949_000)).toBe(982_500) // 6.949M * 20% - 427.5K = 962.3K, + 2.1% = 982.508K, rounded down to 982.5K
  })

  it('calculates tax correctly for income between 6,950,000 and 9,000,000 yen', () => {
    expect(calculateNationalIncomeTax(6_950_000)).toBe(982_700) // 6.95M * 23% - 636K = 962.5K, + 2.1% = 982.713K, rounded down to 982.7K
    expect(calculateNationalIncomeTax(8_999_000)).toBe(1_463_800) // 8.999M * 23% - 636K = 1.43377M, + 2.1% = 1.46388M, rounded down to 1.4638M
  })

  it('calculates tax correctly for income between 9,000,000 and 18,000,000 yen', () => {
    expect(calculateNationalIncomeTax(9_000_000)).toBe(1_464_100) // 9M * 33% - 1.536M = 1.434M, + 2.1% = 1.46414M, rounded down to 1.4641M
    expect(calculateNationalIncomeTax(17_999_000)).toBe(4_496_100) // 17.999M * 33% - 1.536M = 4.40367M, + 2.1% = 4.49615M, rounded down to 4.4961M
  })

  it('calculates tax correctly for income between 18,000,000 and 40,000,000 yen', () => {
    expect(calculateNationalIncomeTax(18_000_000)).toBe(4_496_400) // 18M * 40% - 2.796M = 4.404M, + 2.1% = 4.49648M, rounded down to 4.4964M
    expect(calculateNationalIncomeTax(39_999_000)).toBe(13_480_800) // 39.999M * 40% - 2.796M = 13.2036M, + 2.1% = 13.48088M, rounded down to 13.4808M
  })

  it('calculates tax correctly for income above 40,000,000 yen', () => {
    expect(calculateNationalIncomeTax(40_000_000)).toBe(13_481_200) // 40M * 45% - 4.796M = 13.204M, + 2.1% = 13.48128M, rounded down to 13.4812M
    expect(calculateNationalIncomeTax(50_000_000)).toBe(18_075_700) // 50M * 45% - 4.796M = 17.704M, + 2.1% = 18.07578M, rounded down to 18.0757M
  })

  it('handles zero income correctly', () => {
    expect(calculateNationalIncomeTax(0)).toBe(0)
  })

  it('handles negative income correctly', () => {
    expect(calculateNationalIncomeTax(-1_000_000)).toBe(0) // Negative income is clamped to 0
  })
})

describe('calculateResidenceTaxBasicDeduction', () => {
  it('returns 430,000 yen for income up to 24,000,000 yen', () => {
    expect(calculateResidenceTaxBasicDeduction(0)).toBe(430_000)
    expect(calculateResidenceTaxBasicDeduction(10_000_000)).toBe(430_000)
    expect(calculateResidenceTaxBasicDeduction(24_000_000)).toBe(430_000)
  })

  it('returns 290,000 yen for income between 24,000,001 and 24,500,000 yen', () => {
    expect(calculateResidenceTaxBasicDeduction(24_000_001)).toBe(290_000)
    expect(calculateResidenceTaxBasicDeduction(24_500_000)).toBe(290_000)
  })

  it('returns 150,000 yen for income between 24,500,001 and 25,000,000 yen', () => {
    expect(calculateResidenceTaxBasicDeduction(24_500_001)).toBe(150_000)
    expect(calculateResidenceTaxBasicDeduction(25_000_000)).toBe(150_000)
  })

  it('returns 0 yen for income above 25,000,000 yen', () => {
    expect(calculateResidenceTaxBasicDeduction(25_000_001)).toBe(0)
    expect(calculateResidenceTaxBasicDeduction(30_000_000)).toBe(0)
  })

  it('handles negative income correctly', () => {
    expect(calculateResidenceTaxBasicDeduction(-1_000_000)).toBe(430_000)
  })
})

describe('calculateResidenceTax', () => {
  it('calculates tax correctly for income with full deductions', () => {
    // Example: 5M income, 1M social insurance
    expect(calculateResidenceTax(5_000_000, 1_000_000)).toBe(362_000) // (5M - 1M - 430K) * 0.1 + 5000
  })

  it('calculates tax correctly for income with partial basic deduction', () => {
    // Example: 24.2M income, 1M social insurance
    expect(calculateResidenceTax(24_200_000, 1_000_000)).toBe(2_296_000) // (24.2M - 1M - 290K) * 0.1 + 5000
  })

  it('calculates tax correctly for income with minimum basic deduction', () => {
    // Example: 24.7M income, 1M social insurance
    expect(calculateResidenceTax(24_700_000, 1_000_000)).toBe(2_360_000) // (24.7M - 1M - 150K) * 0.1 + 5000
  })

  it('calculates tax correctly for income with no basic deduction', () => {
    // Example: 26M income, 1M social insurance
    expect(calculateResidenceTax(26_000_000, 1_000_000)).toBe(2_505_000) // (26M - 1M - 0) * 0.1 + 5000
  })

  it('returns minimum tax amount when deductions exceed income', () => {
    // Example: 1M income, 2M social insurance
    expect(calculateResidenceTax(1_000_000, 2_000_000)).toBe(5_000) // Only 5000 yen 均等割 when taxable income is 0
  })

  it('handles zero income correctly', () => {
    expect(calculateResidenceTax(0, 0)).toBe(5_000) // Only 5000 yen 均等割 when taxable income is 0
  })

  it('handles negative income correctly', () => {
    expect(calculateResidenceTax(-1_000_000, 0)).toBe(5_000) // Only 5000 yen 均等割 when taxable income is 0
  })
}) 