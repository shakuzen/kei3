import { describe, it, expect } from 'vitest';
import { calculateTaxes } from '../utils/taxCalculations';
import type { FurusatoNozeiDetails } from '../types/tax';

describe('calculateFurusatoNozeiLimit', () => {

  it('calculates furusato nozei for the default salary', () => {
    const fn = calculateFNForIncome(5_000_000);
    expect(fn.limit).toBe(61_000);
    expect(fn.outOfPocketCost).toBe(2000);
    expect(fn.incomeTaxReduction).toBe(6000);
    expect(fn.residenceTaxReduction).toBe(53_000);
  });

  it('calculates furusato nozei for the salary with lower out-of-pocket cost', () => {
    const fn = calculateFNForIncome(6_000_000);
    expect(fn.limit).toBe(77_000);
    expect(fn.outOfPocketCost).toBe(1800);
    expect(fn.incomeTaxReduction).toBe(7700);
    expect(fn.residenceTaxReduction).toBe(67_500);
  });

  it('calculates furusato nozei for the salary with slightly higher out-of-pocket cost', () => {
    const fn = calculateFNForIncome(8_800_000);
    expect(fn.limit).toBe(151_000);
    expect(fn.outOfPocketCost).toBe(2100);
    expect(fn.incomeTaxReduction).toBe(30_400);
    expect(fn.residenceTaxReduction).toBe(118_500);
  });

  it('high-income salary, high out-of-pocket cost', () => {
    const fn = calculateFNForIncome(13_000_000);
    expect(fn.outOfPocketCost).toBe(31_500);
    expect(fn.limit).toBe(327_000);
    expect(fn.incomeTaxReduction).toBe(80_000);
    expect(fn.residenceTaxReduction).toBe(215_500);
  });

  it('mid range salary, high out-of-pocket cost', () => {
    const fn = calculateFNForIncome(6_500_000);
    expect(fn.limit).toBe(98_000);
    expect(fn.outOfPocketCost).toBe(11_800);
    expect(fn.incomeTaxReduction).toBe(9800);
    expect(fn.residenceTaxReduction).toBe(76_400);
  });

  it('returns 0 for zero or negative taxable income', () => {
    expect(calculateFNForIncome(0).limit).toBe(0);
    expect(calculateFNForIncome(-1000).limit).toBe(0);
  });

  it('furusato nozei limit is reduced by DC plan contributions', () => {
    const fn = calculateTaxes({
      annualIncome: 5_000_000,
      isEmploymentIncome: true,
      isSubjectToLongTermCarePremium: false,
      prefecture: 'Tokyo',
      showDetailedInput: false,
      healthInsuranceProvider: 'KyokaiKenpo',
      numberOfDependents: 0,
      dcPlanContributions: 240_000 // 20,000 yen per month
    }).furusatoNozei;

    const fnWithoutDC = calculateFNForIncome(5_000_000);

    expect(fn.limit).toBeLessThan(fnWithoutDC.limit);
    expect(fn.limit).toBe(55_000);
    expect(fn.outOfPocketCost).toBe(4700);
  });
});

function calculateFNForIncome(income: number) : FurusatoNozeiDetails {
  return calculateTaxes({
    annualIncome: income,
    isEmploymentIncome: true,
    isSubjectToLongTermCarePremium: false,
    prefecture: 'Tokyo',
    showDetailedInput: false,
    healthInsuranceProvider: 'KyokaiKenpo',
    numberOfDependents: 0,
    dcPlanContributions: 0
  }).furusatoNozei;
}
