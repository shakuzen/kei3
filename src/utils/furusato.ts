/**
 * Calculate the maximum deductible ふるさと納税 (Furusato Nozei) donation limit for which the user's out-of-pocket cost is 2,000 yen.
 *
 * This uses the detailed, accurate method based on the actual tax calculation formulas.
 *
 * @param taxableIncomeForResidenceTax - Taxable income for residence tax (住民税課税所得)
 * @param taxableIncomeForNationalIncomeTax - Taxable income for national income tax (所得税課税所得)
 * @param useOneStop - Whether the one-stop system (ワンストップ特例) is used (default: false)
 * @returns The donation limit (rounded down to the nearest 1,000 yen)
 */
export function calculateFurusatoNozeiLimit(
    taxableIncomeForResidenceTax: number,
    taxableIncomeForNationalIncomeTax: number,
    useOneStop: boolean = false
): number {
    if (taxableIncomeForResidenceTax <= 0 || taxableIncomeForNationalIncomeTax <= 0) {
        return 0; // No donation limit if income is zero or negative
    }
    const residenceTaxRate = 0.10; // Resident tax rate for income portion (住民税所得割額)
    const residentTaxAmountForIncomePortion = taxableIncomeForResidenceTax * residenceTaxRate;

    // TODO: Handle the case where the donation amount changes the marginal income tax rate.
    const marginalIncomeTaxRate = calculateMarginalIncomeTaxRate(taxableIncomeForNationalIncomeTax, true);

    // Special deduction rate for resident tax (特例控除割合)
    let specialDeductionRate = 1 - residenceTaxRate - marginalIncomeTaxRate;

    // If one-stop system is used, the deduction method changes:
    // The entire deduction is applied to resident tax (no income tax deduction),
    // and the special deduction rate is adjusted accordingly.
    // See: https://kaikei7.com/furusato_nouzei_onestop/
    if (useOneStop) {
        // The special deduction is increased to cover what would have been the income tax deduction.
        // The formula for the special deduction rate becomes:
        // specialDeductionRate = 0.90 - (incomeTaxRate / (1 - incomeTaxRate))
        // But in practice, the deduction is:
        // Resident tax basic deduction: (X - 2000) * residenceTaxRate
        // Resident tax special deduction: (X - 2000) * (0.90 - (incomeTaxRate / (1 - incomeTaxRate)))
        // See: https://kaikei7.com/furusato_nouzei_onestop/
        specialDeductionRate = 1 - residenceTaxRate - (marginalIncomeTaxRate / (1 - marginalIncomeTaxRate));
    }

    // The deduction breakdown:
    // Income tax deduction: (X - 2000) * incomeTaxRate (not used if one-stop)
    // Resident tax basic deduction: (X - 2000) * residenceTaxRate
    // Resident tax special deduction: (X - 2000) * specialDeductionRate (capped at 20% of resident tax amount for the income portion)

    // We need to find X such that:
    // (X - 2000) * specialDeductionRate <= residentTaxAmountForIncomePortion * 0.2
    const maxSpecialDeduction = residentTaxAmountForIncomePortion * 0.2;
    const furusatoNozeiLimit = maxSpecialDeduction / specialDeductionRate + 2000;

    // Statutory cap: donation cannot exceed 30% of resident tax taxable income
    const statutoryCap = taxableIncomeForResidenceTax * 0.3;

    // Final limit is the lower of the two, rounded down to the nearest 1,000 yen
    return Math.floor(Math.min(furusatoNozeiLimit, statutoryCap) / 1000) * 1000;
}

function calculateMarginalIncomeTaxRate(taxableIncome: number, includeSpecialReconstructionSurtax: boolean = false): number {
    let taxRate = 0;
    if (taxableIncome <= 1950000) taxRate = 0.05;
    else if (taxableIncome <= 3300000) taxRate = 0.10;
    else if (taxableIncome <= 6950000) taxRate = 0.20;
    else if (taxableIncome <= 9000000) taxRate = 0.23;
    else if (taxableIncome <= 18000000) taxRate = 0.33;
    else if (taxableIncome <= 40000000) taxRate = 0.40;
    else taxRate = 0.45; // Over 40 million

    if (includeSpecialReconstructionSurtax) {
        taxRate *= 1.021; // Add 2.1% surtax
    }

    return taxRate;
}
