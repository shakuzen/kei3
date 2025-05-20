import type { TaxResults } from '../types/tax'

/**
 * Calculates health insurance premiums for the insured person based on income and age
 * Includes nursing care insurance for those over 40
 * Source: Kyokai Kenpo Tokyo https://www.kyoukaikenpo.or.jp/g7/cat330/sb3150/r07/r7ryougakuhyou3gatukara/
 */
export const calculateHealthInsurance = (income: number, isOver40: boolean): number => {
    // Base health insurance rate (9.91% of income)
    const baseRate = 0.0991;

    // Nursing care insurance rate (1.59% of income) for those over 40
    const nursingCareRate = isOver40 ? 0.0159 : 0;

    // Total rate (employee pays 50%)
    const totalRate = (baseRate + nursingCareRate) / 2;

    // Calculate premium with maximum cap
    // Maximum monthly premium is 79,925 yen for over 40, 68,874.5 yen for under 40
    const monthlyCap = isOver40 ? 79925 : 68874.5;
    const annualCap = Math.round(monthlyCap * 12);

    return Math.round(Math.min(income * totalRate, annualCap));
}

/**
 * Calculates pension payments based on income and employment status
 * Source: Japan Pension Service rates
 * For employment income: 9.15% of income (employees' pension) with monthly cap of 59,475 yen
 * https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku/ryogakuhyo/20200825.html
 * For non-employment income: Fixed annual national pension contribution (17,510 yen per month for 2025)
 * https://www.nenkin.go.jp/service/kokunen/hokenryo/hokenryo.html#cms01
 */
export const calculatePensionPayments = (income: number, isEmploymentIncome: boolean): number => {
    if (isEmploymentIncome) {
        // Employees' pension (厚生年金) - 9.15% of income with cap
        const baseRate = 0.0915;
        const monthlyCap = 59475;
        const annualCap = monthlyCap * 12;
        return Math.min(income * baseRate, annualCap);
    } else {
        // National pension (国民年金) - fixed monthly contribution
        const monthlyContribution = 17510;
        return monthlyContribution * 12; // Annual contribution
    }
}

/**
 * Calculates the employment income deduction based on the 2025 tax rules
 * Source: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
 */
export const getEmploymentIncomeDeduction = (income: number): number => {
    if (income <= 1625000) {
        return 550000
    } else if (income <= 1800000) {
        return income * 0.4 - 100000
    } else if (income <= 3600000) {
        return income * 0.3 + 80000
    } else if (income <= 6600000) {
        return income * 0.2 + 440000
    } else if (income <= 8500000) {
        return income * 0.1 + 1100000
    } else {
        return 1950000 // Maximum cap
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
 * - 480,000 yen for income up to 24,000,000 yen
 * - Gradually decreases from 24,000,001 yen to 25,000,000 yen
 * - 0 yen for income above 25,000,000 yen
 */
export const calculateNationalIncomeTaxBasicDeduction = (netIncome: number): number => {
    if (netIncome <= 24000000) {
        return 480000;
    } else if (netIncome <= 24500000) {
        return 320000;
    } else if (netIncome <= 25000000) {
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
    let residenceTaxBasicDeduction = calculateResidenceTaxBasicDeduction(netIncome);
    let taxableIncome = Math.floor(Math.max(0, netIncome - socialInsuranceDeduction - residenceTaxBasicDeduction) / 1000) * 1000;
    let cityTax = Math.floor(taxableIncome * 0.06 / 100) * 100;
    let prefecturalTax = Math.floor(taxableIncome * 0.04 / 100) * 100;
    return cityTax + prefecturalTax + 5000; // 10% rate + 5000 yen 均等割
}

export const calculateTaxes = (income: number, isEmploymentIncome: boolean, isOver40: boolean): TaxResults => {
    if (income <= 0) {
        return {
            nationalIncomeTax: 0,
            residenceTax: 0,
            healthInsurance: 0,
            pensionPayments: 0,
            totalTax: 0,
            takeHomeIncome: 0
        }
    }
    let netIncome = isEmploymentIncome ? income - getEmploymentIncomeDeduction(income) : income;

    // Health insurance (simplified)
    // Include nursing care insurance for those over 40
    let healthInsurance = calculateHealthInsurance(income, isOver40);

    let pensionPayments = calculatePensionPayments(income, isEmploymentIncome);

    let employmentInsurance = calculateEmploymentInsurance(income, isEmploymentIncome);

    let socialInsuranceDeduction = healthInsurance + pensionPayments + employmentInsurance;

    let nationalIncomeTaxBasicDeduction = calculateNationalIncomeTaxBasicDeduction(netIncome);

    // Round down taxable income to the nearest thousand yen
    let taxableIncomeForNationalIncomeTax = Math.floor((netIncome - socialInsuranceDeduction - nationalIncomeTaxBasicDeduction) / 1000) * 1000;

    let nationalIncomeTax = calculateNationalIncomeTax(taxableIncomeForNationalIncomeTax);

    let residenceTax = calculateResidenceTax(netIncome, socialInsuranceDeduction);

    // Calculate totals
    const totalTax = nationalIncomeTax + residenceTax + healthInsurance + pensionPayments
    const takeHomeIncome = income - totalTax

    return {
        nationalIncomeTax,
        residenceTax,
        healthInsurance,
        pensionPayments,
        totalTax,
        takeHomeIncome
    }
} 