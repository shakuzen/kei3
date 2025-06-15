import type { HealthInsuranceProviderId } from "./healthInsurance";
export interface TakeHomeInputs {
  annualIncome: number;
  isEmploymentIncome: boolean;
  isOver40: boolean;
  prefecture: string;
  showDetailedInput: boolean;
  healthInsuranceProvider: HealthInsuranceProviderId;
  numberOfDependents: number;
}

export interface TakeHomeResults {
  annualIncome: number;
  isEmploymentIncome: boolean;
  nationalIncomeTax: number;
  residenceTax: number;
  healthInsurance: number;
  pensionPayments: number;
  employmentInsurance?: number;
  totalTax: number;
  takeHomeIncome: number;
  // Added detailed properties
  netEmploymentIncome?: number;
  nationalIncomeTaxBasicDeduction?: number;
  taxableIncomeForNationalIncomeTax?: number;
  residenceTaxBasicDeduction?: number;
  taxableIncomeForResidenceTax?: number;
}

export interface ChartRange {
  min: number;
  max: number;
}