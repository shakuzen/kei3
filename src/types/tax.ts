import type { HealthInsuranceProviderId } from "./healthInsurance";
export interface TakeHomeInputs {
  annualIncome: number;
  isEmploymentIncome: boolean;
  isOver40: boolean;
  prefecture: string;
  showDetailedInput: boolean;
  healthInsuranceProvider: HealthInsuranceProviderId;
  numberOfDependents: number;
  dcPlanContributions: number;
  mortgageTaxCredit: number;
}

export interface TakeHomeResults {
  annualIncome: number;
  isEmploymentIncome: boolean;
  nationalIncomeTax: number;
  residenceTax: ResidenceTaxDetails;
  healthInsurance: number;
  pensionPayments: number;
  employmentInsurance?: number;
  takeHomeIncome: number;
  // Added detailed properties
  netEmploymentIncome?: number;
  nationalIncomeTaxBasicDeduction?: number;
  taxableIncomeForNationalIncomeTax?: number;
  residenceTaxBasicDeduction?: number;
  taxableIncomeForResidenceTax?: number;
  furusatoNozei: FurusatoNozeiDetails;
  dcPlanContributions: number;
  mortgageTaxCredit: number; // Total applied credit (income + residence)
  mortgageIncomeTaxCredit?: number; // Applied to income tax
  mortgageResidenceTaxCredit?: number; // Applied to residence tax
}

export interface ResidenceTaxDetails {
  taxableIncome: number; // 市町村民税の課税標準額
  cityProportion: number;
  prefecturalProportion: number;
  residenceTaxRate: number;
  basicDeduction: number;
  city: {
    cityTaxableIncome: number;
    cityAdjustmentCredit: number;
    cityIncomeTax: number;
  }
  prefecture: {
    prefecturalTaxableIncome: number;
    prefecturalAdjustmentCredit: number;
    prefecturalIncomeTax: number;
  }
  perCapitaTax: number;
  totalResidenceTax: number;
}

export interface FurusatoNozeiDetails {
  limit: number;
  incomeTaxReduction: number;
  residenceTaxDonationBasicDeduction: number;
  residenceTaxSpecialDeduction: number;
  outOfPocketCost: number;
  residenceTaxReduction: number;
}

export interface ChartRange {
  min: number;
  max: number;
}
