import type { TaxResults } from '../types/tax'

export const calculateTaxes = (income: number, isEmploymentIncome: boolean, isOver40: boolean): TaxResults => {
  // National income tax (simplified progressive tax)
  let nationalIncomeTax = 0
  if (income <= 1950000) {
    nationalIncomeTax = income * 0.05
  } else if (income <= 3300000) {
    nationalIncomeTax = income * 0.1 - 97500
  } else if (income <= 6950000) {
    nationalIncomeTax = income * 0.2 - 427500
  } else if (income <= 9000000) {
    nationalIncomeTax = income * 0.23 - 636000
  } else if (income <= 18000000) {
    nationalIncomeTax = income * 0.33 - 1536000
  } else if (income <= 40000000) {
    nationalIncomeTax = income * 0.4 - 2796000
  } else {
    nationalIncomeTax = income * 0.45 - 4796000
  }

  // Residence tax (simplified)
  const residenceTax = income * 0.1

  // Health insurance (simplified)
  // Include nursing care insurance for those over 40
  const healthInsurance = Math.min(income * (isOver40 ? 0.11 : 0.1), 1500000)

  // Pension payments (simplified)
  const pensionPayments = Math.min(income * 0.09, 800000)

  // Calculate totals
  const totalTax = nationalIncomeTax + residenceTax + healthInsurance + pensionPayments
  const netIncome = income - totalTax

  return {
    nationalIncomeTax,
    residenceTax,
    healthInsurance,
    pensionPayments,
    totalTax,
    netIncome
  }
} 