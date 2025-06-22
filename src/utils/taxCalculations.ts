import type { TakeHomeInputs, TakeHomeResults } from '../types/tax'
import { calculatePensionPremium } from './pensionCalculator';
import { calculateHealthInsurancePremium } from './healthInsuranceCalculator';

/** https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000108634.html */
export const employmentInsuranceRate = 0.0055; // 0.55%

/**
 * Calculates the net employment income based on the tax rules for 2025 income, applying the employment income deduction.
 * Source: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
 */
export const calculateNetEmploymentIncome = (grossEmploymentIncome: number): number => {
    if (grossEmploymentIncome < 651_000) 
        return 0;
    
    if (grossEmploymentIncome < 1_900_000)
        return grossEmploymentIncome - 650_000;

    // From 1.9M yen through 6.6M yen, gross income is rounded down to the nearest 4,000 yen
    const roundedGrossIncome = Math.floor(grossEmploymentIncome / 4000) * 4000;

    if (grossEmploymentIncome <= 3_600_000) {
        return Math.floor(roundedGrossIncome * 0.7) - 80_000
    } else if (grossEmploymentIncome <= 6_600_000) {
        return Math.floor(roundedGrossIncome * 0.8) - 440_000
    } 
    
    if (grossEmploymentIncome <= 8_500_000) {
        return Math.floor(grossEmploymentIncome * 0.9) - 1_100_000
    } else {
        return grossEmploymentIncome - 1_950_000
    }
}

/**
 * Calculates employment insurance premiums based on income
 * Source: Ministry of Health, Labour and Welfare (MHLW) rates for 2025
 * https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000108634.html
 * Note: Only calculates employee portion of the premium.
 * 
 * The premium is calculated monthly with special rounding rules:
 * - 0.55% of monthly salary
 * - Rounding: 
 *   - If decimal is 0.50 yen or less → round down
 *   - If decimal is 0.51 yen or more → round up
 * - Annual total is the sum of 12 monthly premiums
 */
export const calculateEmploymentInsurance = (annualIncome: number, isEmploymentIncome: boolean): number => {
    // If not employment income, no employment insurance is required
    if (!isEmploymentIncome || annualIncome <= 0) {
        return 0;
    }

    const monthlySalary = annualIncome / 12;
    let annualPremium = 0;


    for (let i = 0; i < 12; i++) {
        const monthlyPremium = monthlySalary * employmentInsuranceRate;
        // Apply special rounding rules
        const decimal = monthlyPremium - Math.floor(monthlyPremium);
        let roundedPremium: number;
        
        if (decimal <= 0.5) {
            roundedPremium = Math.floor(monthlyPremium);
        } else {
            roundedPremium = Math.ceil(monthlyPremium);
        }
        
        annualPremium += roundedPremium;
    }

    return Math.max(annualPremium, 0);
}

/**
 * Calculates the basic deduction (基礎控除) for national income tax based on income
 * Source: National Tax Agency https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm
 * 2025 Update: https://www.nta.go.jp/users/gensen/2025kiso/index.htm#a-01
 * 
 * 2025 Changes:
 * - 1,320,000 yen or less: 950,000 yen (was 480,000 yen)
 * - 1,320,001 - 3,360,000 yen: 880,000 yen (will be 580,000 from 2027) (was 480,000 yen)
 * - 3,360,001 - 4,890,000 yen: 680,000 yen (will be 580,000 from 2027) (was 480,000 yen)
 * - 4,890,001 - 6,550,000 yen: 630,000 yen (will be 580,000 from 2027) (was 480,000 yen)
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

    // 調整控除額
    let adjustmentDeduction = 0;
    // 人的控除額調整控除 - 50,000 yen for the basic deduction; should be updated if other deductions are added to the calculator
    const personalDeductionDifference = 50_000;
    if (netIncome <= 2_000_000) {
        adjustmentDeduction = Math.min(personalDeductionDifference * 0.05, taxableIncome * 0.05);
    } else if (netIncome <= 25_000_000) {
        adjustmentDeduction = Math.max((personalDeductionDifference - (taxableIncome - 2_000_000)) * 0.05, personalDeductionDifference * 0.05);
    }
    // The split between city and prefectural tax varies by municipality, but this is the split for Tokyo 23 wards. Update when other municipalities are added.
    const cityAdjustmentDeduction = adjustmentDeduction * 0.6;
    const prefecturalAdjustmentDeduction = adjustmentDeduction * 0.4;

    const cityTax = Math.floor(((taxableIncome * 0.06) - cityAdjustmentDeduction) / 100) * 100;
    const prefecturalTax = Math.floor(((taxableIncome * 0.04) - prefecturalAdjustmentDeduction) / 100) * 100;
    const perCapitaTax = 5000; // 均等割額 (fixed amount per person, varies by municipality)
    return cityTax + prefecturalTax + perCapitaTax;
}

const DEFAULT_TAKE_HOME_RESULTS: TakeHomeResults = {
    annualIncome: 0,
    isEmploymentIncome: true,
    nationalIncomeTax: 0,
    residenceTax: 0,
    healthInsurance: 0,
    pensionPayments: 0,
    employmentInsurance: 0,
    takeHomeIncome: 0
};

export const calculateTaxes = (inputs: TakeHomeInputs): TakeHomeResults => {
    if (inputs.annualIncome <= 0) {
        return DEFAULT_TAKE_HOME_RESULTS;
    }
    const annualIncome = inputs.annualIncome;
    const isEmploymentIncome = inputs.isEmploymentIncome;
    const netIncome = isEmploymentIncome ? calculateNetEmploymentIncome(annualIncome) : annualIncome;

    const healthInsurance = calculateHealthInsurancePremium(
        inputs.annualIncome,
        inputs.isOver40,
        inputs.healthInsuranceProvider,
        inputs.prefecture
    );

    const pensionPayments = calculatePensionPremium(isEmploymentIncome, annualIncome / 12);

    const employmentInsurance = calculateEmploymentInsurance(annualIncome, isEmploymentIncome);

    const socialInsuranceDeduction = healthInsurance + pensionPayments + employmentInsurance;

    const nationalIncomeTaxBasicDeduction = calculateNationalIncomeTaxBasicDeduction(netIncome);

    const taxableIncomeForNationalIncomeTax = Math.max(0, Math.floor((netIncome - socialInsuranceDeduction - nationalIncomeTaxBasicDeduction) / 1000) * 1000);

    const nationalIncomeTax = calculateNationalIncomeTax(taxableIncomeForNationalIncomeTax);

    const residenceTaxBasicDeduction = calculateResidenceTaxBasicDeduction(netIncome);
    const taxableIncomeForResidenceTax = Math.max(0, Math.floor(Math.max(0, netIncome - socialInsuranceDeduction - residenceTaxBasicDeduction) / 1000) * 1000);

    const residenceTax = calculateResidenceTax(netIncome, socialInsuranceDeduction);

    // Calculate totals
    const totalSocialsAndTax = nationalIncomeTax + residenceTax + healthInsurance + pensionPayments + employmentInsurance;
    const takeHomeIncome = annualIncome - totalSocialsAndTax;

    return {
        annualIncome,
        isEmploymentIncome,
        nationalIncomeTax,
        residenceTax,
        healthInsurance,
        pensionPayments,
        employmentInsurance,
        takeHomeIncome,
        netEmploymentIncome: isEmploymentIncome ? netIncome : undefined,
        nationalIncomeTaxBasicDeduction,
        taxableIncomeForNationalIncomeTax,
        residenceTaxBasicDeduction,
        taxableIncomeForResidenceTax,
    };
}
