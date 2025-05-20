export interface TaxInputs {
  annualIncome: number
  isEmploymentIncome: boolean
  isOver40: boolean
  prefecture: string
  showDetailedInput: boolean
  healthInsuranceProvider: string
  numberOfDependents: number
}

export interface TaxResults {
  nationalIncomeTax: number
  residenceTax: number
  healthInsurance: number
  pensionPayments: number
  totalTax: number
  takeHomeIncome: number
}

export interface ChartRange {
  min: number
  max: number
} 