import type { EmployeesHealthInsurancePremiumTableRow, ProviderRegion, NationalHealthInsuranceRegionParams, HealthInsuranceProviderId } from '../types/healthInsurance';
import { getHealthInsurancePremiumTable } from '../data/employeesHealthInsurance';
import { getNationalHealthInsuranceParams } from '../data/nationalHealthInsurance';
import { DEFAULT_PROVIDER_REGION, HealthInsuranceProvider } from '../types/healthInsurance';

/**
 * Calculates the annual health insurance premium.
 *
 * @param annualIncome The person's total annual income.
 * @param includeNursingCareInsurance True if the person is a Category 2 insured
 * for long-term care insurance (介護保険第２号被保険者).
 * @param provider The health insurance provider.
 * @param region The region for the provider.
 *               For KyokaiKenpo, this is KyokaiKenpoRegion.
 *               For National Health Insurance, this is a string (municipality identifier).
 *               For providers with no regions, this is DEFAULT_PROVIDER_REGION.
 * @returns The annual health insurance premium.
 */
export function calculateHealthInsurancePremium(
    annualIncome: number,
    includeNursingCareInsurance: boolean,
    provider: HealthInsuranceProviderId,
    region: ProviderRegion = DEFAULT_PROVIDER_REGION
): number {
    if (annualIncome < 0) {
        throw new Error('Income cannot be negative.');
    }

    if (provider === HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.id) {
        // The 'region' parameter for NHI is expected to be a string (municipality key).
        const nhiParams = getNationalHealthInsuranceParams(region as string);
        if (!nhiParams) {
            console.error(`National Health Insurance parameters not found for region: ${region}. Returning 0 premium.`);
            return 0; // Or throw an error, depending on desired behavior
        }
        return calculateNationalHealthInsurancePremiumLogic(annualIncome, includeNursingCareInsurance, nhiParams);
    } else {
        // For employee-based insurance providers (Kyokai Kenpo, other unions, etc.)
        const premiumTable = getHealthInsurancePremiumTable(provider, region);
        if (!premiumTable) {
            console.error(`Premium table not found for provider ${provider} and region ${region}. Returning 0 premium.`);
            return 0; // Or throw an error
        }
        return calculateEmployeesHealthInsurancePremium(annualIncome / 12, includeNursingCareInsurance, premiumTable);
    }
}

/**
 * Calculates National Health Insurance premium based on regional parameters.
 */
function calculateNationalHealthInsurancePremiumLogic(
    annualIncome: number,
    includeNursingCareInsurance: boolean, // Person is 40-64 years old
    params: NationalHealthInsuranceRegionParams
): number {
    // Calculate NHI taxable income (住民税算定基礎額等 - often previous year's income minus a standard deduction)
    // For simplicity, using current annual income minus the NHI standard deduction.
    // Real-world calculations might use prior year's certified income.
    const nhiTaxableIncome = Math.max(0, annualIncome - params.nhiStandardDeduction);

    // 1. Medical Portion (医療分)
    const incomeBasedMedical = nhiTaxableIncome * params.medicalRate;
    const perCapitaMedical = params.medicalPerCapita;
    const totalMedicalPremium = Math.min(incomeBasedMedical + perCapitaMedical, params.medicalCap);

    // 2. Elderly Support Portion (後期高齢者支援金分)
    const incomeBasedSupport = nhiTaxableIncome * params.supportRate;
    const perCapitaSupport = params.supportPerCapita;
    const totalSupportPremium = Math.min(incomeBasedSupport + perCapitaSupport, params.supportCap);

    // 3. Long-Term Care Portion (介護納付金分) - only for those aged 40-64
    let totalLtcPremium = 0;
    if (includeNursingCareInsurance && params.ltcRateForEligible && params.ltcPerCapitaForEligible && params.ltcCapForEligible) {
        const incomeBasedLtc = nhiTaxableIncome * params.ltcRateForEligible;
        const perCapitaLtc = params.ltcPerCapitaForEligible;
        totalLtcPremium = Math.min(incomeBasedLtc + perCapitaLtc, params.ltcCapForEligible);
    }

    const totalPremium = totalMedicalPremium + totalSupportPremium + totalLtcPremium;
    return Math.round(totalPremium);
}

function calculateEmployeesHealthInsurancePremium(
    monthlyIncome: number,
    includeNursingCareInsurance: boolean,
    premiumTable: EmployeesHealthInsurancePremiumTableRow[]
): number {
    if (premiumTable.length === 0) {
        throw new Error('Provided premium table is empty.');
    }

    for (const row of premiumTable) {
        if (monthlyIncome >= row.minIncomeInclusive && monthlyIncome < row.maxIncomeExclusive) {
            // This function calculates and returns the employee's share of the premium.
            const monthlyPremium = includeNursingCareInsurance ? row.employeePremiumWithLTC : row.employeePremiumNoLTC;
            return Math.round(monthlyPremium) * 12;
        }
    }

    // This part is reached if no bracket matches.
    // Given the last bracket usually has maxIncomeExclusive = Infinity,
    // this should ideally not be reached for valid positive incomes if the table is comprehensive and correctly structured.
    throw new Error(`Monthly income ${monthlyIncome.toLocaleString()} is outside the defined ranges in the provided premium table.`);
}
