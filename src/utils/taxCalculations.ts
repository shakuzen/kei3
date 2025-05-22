import type { TakeHomeResults } from '../types/tax'
import { calculatePensionPremium } from './pensionCalculator';
import { calculateHealthInsurancePremium } from './healthInsuranceCalculator';

/**
 * Calculates the employment income deduction based on the 2025 tax rules
 * Source: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
 */
export const getEmploymentIncomeDeduction = (income: number): number => {
    if (income <= 1_900_000) {
        return 650_000 // 2025 Update
    } else if (income <= 3_600_000) {
        return income * 0.3 + 80_000
    } else if (income <= 6_600_000) {
        return income * 0.2 + 440_000
    } else if (income <= 8_500_000) {
        return income * 0.1 + 1_100_000
    } else {
        return 1_950_000 // Maximum cap
    }
}

/**
 * Calculates employment insurance premiums based on income
 * Source: Ministry of Health, Labour and Welfare (MHLW) rates for 2025
 * https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000108634.html
 * Note: Only calculates employee portion (0.55% of income)
 */
export const calculateEmploymentInsurance = (income: number, isEmploymentIncome: boolean): number => {
    // If not employment income, no employment insurance is required
    if (!isEmploymentIncome) {
        return 0;
    }

    // Employee portion is 0.55% of income
    const employeeRate = 0.0055;

    return Math.max(Math.round(income * employeeRate), 0);
}

/**
 * Calculates the basic deduction (基礎控除) for national income tax based on income
 * Source: National Tax Agency https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm
 * 2025 Update: https://www.nta.go.jp/users/gensen/2025kiso/index.htm#a-01
 * 
 * 2025 Changes:
 * - 1,320,000 yen or less: 950,000 yen (was 480,000 yen)
 * - 1,320,001 - 3,360,000 yen: 880,000 yen (will be 580,000 yen from 2027) (was 480,000 yen)
 * - 3,360,001 - 4,890,000 yen: 680,000 yen (will be 580,000 yen from 2027) (was 480,000 yen)
 * - 4,890,001 - 6,550,000 yen: 630,000 yen (will be 580,000 yen from 2027) (was 480,000 yen)
 * - 6,550,001 - 23,500,000 yen: 580,000 yen (was 480,000 yen)
 * - Over 23,500,000 yen: no change
 */
export const calculateNationalIncomeTaxBasicDeduction = (netIncome: number): number => {
    if (netIncome <= 1_320_000) {
        return 950_000; // Up from 480,000 yen
    } else if (netIncome <= 3_360_000) {
        return 880_000; // Will be 580,000 from 2027 (currently 480,000 in 2024)
    } else if (netIncome <= 4_890_000) {
        return 680_000; // Will be 580,000 from 2027 (currently 480,000 in 2024)
    } else if (netIncome <= 6_550_000) {
        return 630_000; // Will be 580,000 from 2027 (currently 480,000 in 2024)
    } else if (netIncome <= 23_500_000) {
        return 580_000; // Up from 480,000 yen
    } else if (netIncome <= 24000000) { // No change for income over 23.5M yen
        return 480000;
    } else if (netIncome <= 24500000) { // No change for income over 23.5M yen
        return 320000;
    } else if (netIncome <= 25000000) { // No change for income over 23.5M yen
        return 160000;
    } else {
        return 0;
    }
}

/**
 * Calculates national income tax based on taxable income, including the 2.1% reconstruction surtax
 * Source: National Tax Agency tax brackets for 2025
 * https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
 * Note: Result is rounded down to the nearest 100 yen
 */
export const calculateNationalIncomeTax = (taxableIncome: number): number => {
    // Clamp taxable income to 0 if negative
    taxableIncome = Math.max(0, taxableIncome);

    let baseTax = 0;
    if (taxableIncome <= 1949000) {
        baseTax = taxableIncome * 0.05;
    } else if (taxableIncome <= 3299000) {
        baseTax = taxableIncome * 0.1 - 97500;
    } else if (taxableIncome <= 6949000) {
        baseTax = taxableIncome * 0.2 - 427500;
    } else if (taxableIncome <= 8999000) {
        baseTax = taxableIncome * 0.23 - 636000;
    } else if (taxableIncome <= 17999000) {
        baseTax = taxableIncome * 0.33 - 1536000;
    } else if (taxableIncome <= 39999000) {
        baseTax = taxableIncome * 0.4 - 2796000;
    } else {
        baseTax = taxableIncome * 0.45 - 4796000;
    }

    // Add 2.1% reconstruction surtax
    const reconstructionSurtax = baseTax * 0.021;

    // Round down to the nearest 100 yen
    return Math.floor((baseTax + reconstructionSurtax) / 100) * 100;
}

/**
 * Calculates the basic deduction (基礎控除) for residence tax based on income
 * Source: https://www.machi-gr-blog.com/【住民税】給与所得控除・基礎控除の改正でどう変わる？/
 * - 430,000 yen for income up to 24,000,000 yen
 * - 290,000 yen for income between 24,000,001 and 24,500,000 yen
 * - 150,000 yen for income between 24,500,001 and 25,000,000 yen
 * - 0 yen for income above 25,000,000 yen
 */
export const calculateResidenceTaxBasicDeduction = (netIncome: number): number => {
    if (netIncome <= 24000000) {
        return 430000;
    } else if (netIncome <= 24500000) {
        return 290000;
    } else if (netIncome <= 25000000) {
        return 150000;
    } else {
        return 0;
    }
}

/**
 * Calculates residence tax (住民税) based on net income and deductions
 * Rate: 10% (6% municipal tax + 4% prefectural tax) of taxable income
 * Taxable income = net income - social insurance deductions - residence tax basic deduction
 * The details vary by municipality, but most deviate little from this calculation.
 * https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju
 */
export const calculateResidenceTax = (
    netIncome: number,
    socialInsuranceDeduction: number
): number => {
    if (netIncome <= 450_000) {
        return 0; // 非課税制度
    }
    const residenceTaxBasicDeduction = calculateResidenceTaxBasicDeduction(netIncome);
    const taxableIncome = Math.floor(Math.max(0, netIncome - socialInsuranceDeduction - residenceTaxBasicDeduction) / 1000) * 1000;
    const cityTax = Math.floor(taxableIncome * 0.06 / 100) * 100;
    const prefecturalTax = Math.floor(taxableIncome * 0.04 / 100) * 100;
    return cityTax + prefecturalTax + 5000; // 10% rate + 5000 yen 均等割
}

export const calculateTaxes = (annualIncome: number, isEmploymentIncome: boolean, isOver40: boolean): TakeHomeResults => {
    if (annualIncome <= 0) {
        return {
            nationalIncomeTax: 0,
            residenceTax: 0,
            healthInsurance: 0,
            pensionPayments: 0,
            employmentInsurance: 0,
            totalTax: 0,
            takeHomeIncome: 0
        }
    }
    const netIncome = isEmploymentIncome ? annualIncome - getEmploymentIncomeDeduction(annualIncome) : annualIncome;

    const healthInsurance = calculateHealthInsurancePremium(annualIncome, isOver40, isEmploymentIncome);

    const pensionPayments = calculatePensionPremium(isEmploymentIncome, annualIncome / 12);

    const employmentInsurance = calculateEmploymentInsurance(annualIncome, isEmploymentIncome);

    const socialInsuranceDeduction = healthInsurance + pensionPayments + employmentInsurance;

    const nationalIncomeTaxBasicDeduction = calculateNationalIncomeTaxBasicDeduction(netIncome);

    // Round down taxable income to the nearest thousand yen
    const taxableIncomeForNationalIncomeTax = Math.floor((netIncome - socialInsuranceDeduction - nationalIncomeTaxBasicDeduction) / 1000) * 1000;

    const nationalIncomeTax = calculateNationalIncomeTax(taxableIncomeForNationalIncomeTax);

    const residenceTax = calculateResidenceTax(netIncome, socialInsuranceDeduction);

    // Calculate totals
    const totalTax = nationalIncomeTax + residenceTax + healthInsurance + pensionPayments + employmentInsurance
    const takeHomeIncome = annualIncome - totalTax

    return {
        nationalIncomeTax,
        residenceTax,
        healthInsurance,
        pensionPayments,
        employmentInsurance,
        totalTax,
        takeHomeIncome
    }
} 