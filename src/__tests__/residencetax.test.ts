import { describe, expect, it } from "vitest"
import { calculateResidenceTax, calculateResidenceTaxBasicDeduction } from "../utils/residenceTax"

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
    expect(calculateResidenceTax(5_000_000, 1_000_000).totalResidenceTax).toBe(359_500) // (5M - 1M - 430K) * 0.1 + 5000
  })

  it('calculates tax correctly for income with partial basic deduction', () => {
    // Example: 24.2M income, 1M social insurance
    expect(calculateResidenceTax(24_200_000, 1_000_000).totalResidenceTax).toBe(2_293_500) // (24.2M - 1M - 290K) * 0.1 + 5000
  })

  it('calculates tax correctly for income with minimum basic deduction', () => {
    // Example: 24.7M income, 1M social insurance
    expect(calculateResidenceTax(24_700_000, 1_000_000).totalResidenceTax).toBe(2_357_500) // (24.7M - 1M - 150K) * 0.1 + 5000
  })

  it('calculates tax correctly for income with no basic deduction', () => {
    // Example: 26M income, 1M social insurance
    expect(calculateResidenceTax(26_000_000, 1_000_000).totalResidenceTax).toBe(2_505_000) // (26M - 1M - 0) * 0.1 + 5000
  })

  it('returns minimum tax amount when deductions exceed net income', () => {
    // Example: 1M income, 2M social insurance
    expect(calculateResidenceTax(1_000_000, 2_000_000).totalResidenceTax).toBe(5_000) // Only 5000 yen 均等割 when taxable income is 0
  })

  it('returns 0 yen when net income is 450,000 yen or less due to 非課税制度', () => {
    expect(calculateResidenceTax(449_999, 0).totalResidenceTax).toBe(0)
    expect(calculateResidenceTax(450_000, 0).totalResidenceTax).toBe(0)
  })

  it('returns 5000 yen 均等割 when taxable income is 0', () => {
    expect(calculateResidenceTax(450_001, 20_001).totalResidenceTax).toBe(5_000)
    expect(calculateResidenceTax(1_000_000, 600_000).totalResidenceTax).toBe(5_000)
  })

  it('handles zero income correctly', () => {
    expect(calculateResidenceTax(0, 0).totalResidenceTax).toBe(0)
  })

  it('handles negative income correctly', () => {
    expect(calculateResidenceTax(-1_000_000, 0).totalResidenceTax).toBe(0)
  })
})
