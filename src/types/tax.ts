export interface TakeHomeInputs {
  annualIncome: number
  isEmploymentIncome: boolean
  isOver40: boolean
  prefecture: string
  showDetailedInput: boolean
  healthInsuranceProvider: string
  numberOfDependents: number
}

export interface TakeHomeResults {
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