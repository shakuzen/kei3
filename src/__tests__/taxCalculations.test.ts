import { describe, it, expect } from 'vitest'
import { calculateTaxes, getEmploymentIncomeDeduction, calculateEmploymentInsurance, calculateNationalIncomeTaxBasicDeduction, calculateNationalIncomeTax, calculateResidenceTaxBasicDeduction, calculateResidenceTax } from '../utils/taxCalculations'

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
    expect(result.nationalIncomeTax).toBe(12_600)
    expect(result.residenceTax).toBe(34_700)
    expect(result.healthInsurance).toBe(74_916)
    expect(result.pensionPayments).toBe(138_348)
    expect(result.employmentInsurance).toBe(8_250)
    expect(result.totalTax).toBe(268_814)
    expect(result.takeHomeIncome).toBe(1_231_186)
  })

  it('calculates taxes correctly for income between 1,950,000 and 3,300,000 yen', () => {
    const result = calculateTaxes(2_500_000, true, false)
    expect(result.nationalIncomeTax).toBe(42_700)
    expect(result.residenceTax).toBe(93_600)
    expect(result.healthInsurance).toBe(118_920)
    expect(result.pensionPayments).toBe(219_600)
    expect(result.employmentInsurance).toBe(13_750)
    expect(result.totalTax).toBe(488_570)
    expect(result.takeHomeIncome).toBe(2_011_430)
  })

  it('calculates taxes correctly for income between 3,300,000 and 6,950,000 yen', () => {
    const result = calculateTaxes(5_000_000, true, false)
    expect(result.nationalIncomeTax).toBe(141_200)
    expect(result.residenceTax).toBe(245_700)
    expect(result.healthInsurance).toBe(243_792)
    expect(result.pensionPayments).toBe(450_180)
    expect(result.employmentInsurance).toBe(27_500)
    expect(result.totalTax).toBe(1_108_372)
    expect(result.takeHomeIncome).toBe(3_891_628)
  })

  // Test cases for high income brackets
  it('calculates taxes correctly for income above 40,000,000 yen', () => {
    const result = calculateTaxes(50_000_000, true, false)
    expect(result.nationalIncomeTax).toBe(16_345_400) // 50M - 1.95M (employment deduction) - 1.815194M (social insurance) - 0 (basic deduction) = 46.234806M, rounded to 46.234M, then 45% - 4.796M = 16.0093M, + 2.1% = 16.345495M, rounded down to 16.3454M
    expect(result.residenceTax).toBe(4_628_300) // (50M - 1.95M - 1.815194M - 0) = 46.234806M, rounded to 46.234M, then 6% city tax (2.774M) + 4% prefectural tax (1.8493M) + 5K 均等割
    expect(result.healthInsurance).toBe(826_500) // Capped at 68,874.5 * 12
    expect(result.pensionPayments).toBe(713_700) // Capped at 59,475 * 12
    expect(result.employmentInsurance).toBe(275_000) // 50M * 0.55% = 275,000
    expect(result.totalTax).toBe(22_788_900) // 16,345,400 + 4,628,300 + 826,494 + 713,700 + 275,000
    expect(result.takeHomeIncome).toBe(27_211_100)
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
    expect(result.nationalIncomeTax).toBe(333_300)
    expect(result.residenceTax).toBe(387_000)
    expect(result.healthInsurance).toBe(539_380)
    expect(result.pensionPayments).toBe(210_120)
    expect(result.employmentInsurance).toBe(0)
    expect(result.totalTax).toBe(1_469_800)
    expect(result.takeHomeIncome).toBe(3_530_200)
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