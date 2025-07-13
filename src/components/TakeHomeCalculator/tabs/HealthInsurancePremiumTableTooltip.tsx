import React from 'react';
import { Box, Typography } from '@mui/material';
import type { TakeHomeResults, TakeHomeInputs } from '../../../types/tax';
import { formatJPY } from '../../../utils/formatters';
import { HealthInsuranceProvider, DEFAULT_PROVIDER_REGION } from '../../../types/healthInsurance';
import { ALL_EMPLOYEES_HEALTH_INSURANCE_DATA } from '../../../data/employeesHealthInsurance';
import { getNationalHealthInsuranceParams } from '../../../data/nationalHealthInsurance';
import PremiumTableTooltip from './PremiumTableTooltip';

type PremiumTableRow = Record<string, unknown>;

interface HealthInsurancePremiumTableTooltipProps {
  results: TakeHomeResults;
  inputs: TakeHomeInputs;
}

const HealthInsurancePremiumTableTooltip: React.FC<HealthInsurancePremiumTableTooltipProps> = ({ results, inputs }) => {
  const provider = inputs.healthInsuranceProvider;
  const region = inputs.prefecture;
  const monthlyIncome = results.annualIncome / 12;

  if (provider.id === HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.id) {
    // National Health Insurance - show region parameters
    const regionData = getNationalHealthInsuranceParams(region);
    if (!regionData) {
      const fallbackContent = (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            National Health Insurance Parameters
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Premium calculation parameters for {region} are not available in the current data.
          </Typography>
        </Box>
      );

      return (
        <PremiumTableTooltip
          title=""
          description=""
          tableData={[]}
          columns={[]}
          currentRow={null}
          monthlyIncome={monthlyIncome}
          tableContainerDataAttr="data-table-container"
          currentRowId="current-income-row"
          getIncomeRange={() => ''}
          getCurrentRowSummary={() => ''}
          fallbackContent={fallbackContent}
        />
      );
    }

    // Return National Health Insurance parameters display
    const annualIncome = results.annualIncome;
    const includeNursingCareInsurance = inputs.isSubjectToLongTermCarePremium;
    
    // Calculate step-by-step breakdown like the actual calculation
    // Note: NHI premiums are based on previous year's income, but we're using current year as assumption
    const nhiTaxableIncome = Math.max(0, annualIncome - regionData.nhiStandardDeduction);
    
    // 1. Medical Portion (医療分)
    const incomeBasedMedical = nhiTaxableIncome * regionData.medicalRate;
    const perCapitaMedical = regionData.medicalPerCapita;
    const uncappedMedical = incomeBasedMedical + perCapitaMedical;
    const totalMedicalPremium = Math.min(uncappedMedical, regionData.medicalCap);
    
    // 2. Elderly Support Portion (後期高齢者支援金分)
    const incomeBasedSupport = nhiTaxableIncome * regionData.supportRate;
    const perCapitaSupport = regionData.supportPerCapita;
    const uncappedSupport = incomeBasedSupport + perCapitaSupport;
    const totalSupportPremium = Math.min(uncappedSupport, regionData.supportCap);
    
    // 3. Long-Term Care Portion (介護納付金分) - only for those aged 40-64
    let incomeBasedLtc = 0;
    let perCapitaLtc = 0;
    let uncappedLtc = 0;
    let totalLtcPremium = 0;
    if (includeNursingCareInsurance && regionData.ltcRateForEligible && regionData.ltcPerCapitaForEligible && regionData.ltcCapForEligible) {
      incomeBasedLtc = nhiTaxableIncome * regionData.ltcRateForEligible;
      perCapitaLtc = regionData.ltcPerCapitaForEligible;
      uncappedLtc = incomeBasedLtc + perCapitaLtc;
      totalLtcPremium = Math.min(uncappedLtc, regionData.ltcCapForEligible);
    }
    
    const totalCalculatedPremium = totalMedicalPremium + totalSupportPremium + totalLtcPremium;

    const fallbackContent = (
      <Box sx={{ minWidth: { xs: 0, sm: 400 }, maxWidth: { xs: '100vw', sm: 460 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          National Health Insurance - {regionData.regionName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: '0.85rem' }}>
          NHI premiums are calculated using income-based rates plus per-capita amounts, with annual caps applied to each portion.
          NHI premiums are based on last year's reported income.
          These calculations assume your income is the same as the previous year.
        </Typography>

        {/* Medical Portion */}
        <Box sx={{ mb: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem', color: 'primary.main' }}>
            🏥 Medical Portion (医療分)
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
            Income-based: <strong>{(regionData.medicalRate * 100).toFixed(2)}%</strong> × {formatJPY(nhiTaxableIncome)} = {formatJPY(incomeBasedMedical)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
            Per-capita: {formatJPY(perCapitaMedical)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
            Subtotal: {formatJPY(uncappedMedical)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
            Annual Cap: {formatJPY(regionData.medicalCap)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'success.main' }}>
            = Final: {formatJPY(totalMedicalPremium)} {uncappedMedical > regionData.medicalCap ? '(capped)' : ''}
          </Typography>
        </Box>

        {/* Support Portion */}
        <Box sx={{ mb: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem', color: 'primary.main' }}>
            👥 Elderly Support Portion (後期高齢者支援金分)
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
            Income-based: <strong>{(regionData.supportRate * 100).toFixed(2)}%</strong> × {formatJPY(nhiTaxableIncome)} = {formatJPY(incomeBasedSupport)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
            Per-capita: {formatJPY(perCapitaSupport)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
            Subtotal: {formatJPY(uncappedSupport)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
            Annual Cap: {formatJPY(regionData.supportCap)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'success.main' }}>
            = Final: {formatJPY(totalSupportPremium)} {uncappedSupport > regionData.supportCap ? '(capped)' : ''}
          </Typography>
        </Box>

        {/* LTC Portion (if applicable) */}
        {includeNursingCareInsurance && regionData.ltcRateForEligible && (
          <Box sx={{ mb: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem', color: 'primary.main' }}>
              🏠 Long-Term Care Portion (介護納付金分) - Ages 40-64
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
              Income-based: <strong>{(regionData.ltcRateForEligible * 100).toFixed(2)}%</strong> × {formatJPY(nhiTaxableIncome)} = {formatJPY(incomeBasedLtc)}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
              Per-capita: {formatJPY(perCapitaLtc)}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
              Subtotal: {formatJPY(uncappedLtc)}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.3 }}>
              Annual Cap: {formatJPY(regionData.ltcCapForEligible!)}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'success.main' }}>
              = Final: {formatJPY(totalLtcPremium)} {uncappedLtc > regionData.ltcCapForEligible! ? '(capped)' : ''}
            </Typography>
          </Box>
        )}

        {!includeNursingCareInsurance && (
          <Box sx={{ mb: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'action.hover' }}>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'text.secondary' }}>
              🏠 Long-Term Care Portion: Not applicable (under 40 or over 64 years old)
            </Typography>
          </Box>
        )}

        {/* Verification note */}
        {Math.abs(totalCalculatedPremium - results.healthInsurance) > 1 && (
          <Box sx={{ mt: 1, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'warning.contrastText' }}>
              ⚠️ Note: Calculated total ({formatJPY(totalCalculatedPremium)}) differs from system calculation ({formatJPY(results.healthInsurance)}). This may be due to rounding or different calculation methods.
            </Typography>
          </Box>
        )}
      </Box>
    );

    return (
      <PremiumTableTooltip
        title=""
        description=""
        tableData={[]}
        columns={[]}
        currentRow={null}
        monthlyIncome={monthlyIncome}
        tableContainerDataAttr="data-table-container"
        currentRowId="current-income-row"
        getIncomeRange={() => ''}
        getCurrentRowSummary={() => ''}
        fallbackContent={fallbackContent}
      />
    );
  } else {
    // Employee Health Insurance - show premium table
    const providerData = ALL_EMPLOYEES_HEALTH_INSURANCE_DATA[provider.id];
    if (!providerData || !providerData[region]) {
      const fallbackContent = (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Premium Table
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Premium table for {provider.displayName} in {region} is not available in the current data.
          </Typography>
        </Box>
      );

      return (
        <PremiumTableTooltip
          title=""
          description=""
          tableData={[]}
          columns={[]}
          currentRow={null}
          monthlyIncome={monthlyIncome}
          tableContainerDataAttr="data-table-container"
          currentRowId="current-income-row"
          getIncomeRange={() => ''}
          getCurrentRowSummary={() => ''}
          fallbackContent={fallbackContent}
        />
      );
    }

    const premiumTable = providerData[region];
    const premiumTableAsRows = premiumTable as unknown as PremiumTableRow[];
    
    // Find the current row for the user's income
    const currentRow = premiumTableAsRows.find((row) => 
      monthlyIncome >= (row as unknown as { minIncomeInclusive: number; maxIncomeExclusive: number }).minIncomeInclusive && 
      monthlyIncome < (row as unknown as { minIncomeInclusive: number; maxIncomeExclusive: number }).maxIncomeExclusive
    );

    const columns = [
      { header: 'Monthly Salary', getValue: () => 0, align: 'left' as const },
      { header: 'Employee', getValue: (row: PremiumTableRow) => (row as unknown as { employeePremiumNoLTC: number }).employeePremiumNoLTC },
      { header: 'With LTC', getValue: (row: PremiumTableRow) => (row as unknown as { employeePremiumWithLTC: number }).employeePremiumWithLTC },
    ];

    const getIncomeRange = (row: PremiumTableRow) => {
      const healthRow = row as unknown as { minIncomeInclusive: number; maxIncomeExclusive: number };
      return `${formatJPY(healthRow.minIncomeInclusive)} - ${
        healthRow.maxIncomeExclusive === Infinity ? '∞' : formatJPY(healthRow.maxIncomeExclusive)
      }`;
    };

    const getCurrentRowSummary = (row: PremiumTableRow) => {
      const healthRow = row as unknown as { employeePremiumNoLTC: number; employeePremiumWithLTC: number };
      return `Your premium: ${formatJPY(inputs.isSubjectToLongTermCarePremium ? healthRow.employeePremiumWithLTC : healthRow.employeePremiumNoLTC)}/month`;
    };

    return (
      <PremiumTableTooltip
        title={`Health Insurance Premium Table - ${provider.displayName}${region === DEFAULT_PROVIDER_REGION ? '' : ` (${region})`}`}
        description="Monthly premiums by income bracket. Your income: {monthlyIncome}/month"
        hint="💡 LTC stands for Long-Term Care, which is an additional premium insured people ages 40-64 need to pay."
        tableData={premiumTableAsRows}
        columns={columns}
        currentRow={currentRow || null}
        monthlyIncome={monthlyIncome}
        tableContainerDataAttr="data-table-container"
        currentRowId="current-income-row"
        getIncomeRange={getIncomeRange}
        getCurrentRowSummary={getCurrentRowSummary}
      />
    );
  }
};

export default HealthInsurancePremiumTableTooltip;
