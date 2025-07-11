import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { TakeHomeResults, TakeHomeInputs } from '../../../types/tax';
import { formatJPY } from '../../../utils/formatters';
import InsuranceIcon from '@mui/icons-material/HealthAndSafety';
import InfoTooltip from '../../ui/InfoTooltip';
import DetailInfoTooltip from '../../ui/DetailInfoTooltip';
import { ResultRow } from '../ResultRow';
import { employmentInsuranceRate } from '../../../utils/taxCalculations';
import PremiumTableTooltip from './HealthInsurancePremiumTableTooltip';
import PensionPremiumTableTooltip from './PensionPremiumTableTooltip';

interface SocialInsuranceTabProps {
  results: TakeHomeResults;
  inputs: TakeHomeInputs;
}

const SocialInsuranceTab: React.FC<SocialInsuranceTabProps> = ({ results, inputs }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const totalSocialInsurance = results.healthInsurance + results.pensionPayments + (results.employmentInsurance ?? 0);

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          color: 'primary.main',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          fontSize: isMobile ? '1.1rem' : '1.25rem'
        }}
      >
        <InsuranceIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} />
        Social Insurance Details
      </Typography>

      <ResultRow label="Annual Income" value={formatJPY(results.annualIncome)} type="header" />
      {results.isEmploymentIncome ? (
        <ResultRow label="Monthly Income" value={formatJPY(results.annualIncome / 12)} type="default" />
      ) : (
        <>
          <ResultRow label="Basic Deduction" value={formatJPY(-results.residenceTaxBasicDeduction!)} type="default" />
          <ResultRow label="NHI Calculation Base" value={formatJPY(Math.max(0, results.annualIncome - results.residenceTaxBasicDeduction!))} type="default" />
        </>
      )}

      {/* Health Insurance */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          {results.isEmploymentIncome ? "Employees' Health Insurance" : "National Health Insurance"}
          <DetailInfoTooltip
            title="Health Insurance Premium Details"
            children={<PremiumTableTooltip results={results} inputs={inputs} />}
          />
        </Typography>
        {results.isEmploymentIncome ? (
          <>
            <ResultRow 
              label="Monthly Premium" 
              value={formatJPY(results.healthInsurance / 12)} 
              type="indented" 
            />
            <ResultRow 
              label="Annual Premium" 
              value={formatJPY(results.healthInsurance)} 
              type="subtotal" 
            />
          </>
        ) : (
          <>
            <ResultRow
              label="Medical Portion"
              value={formatJPY(results.nhiMedicalPortion ?? 0)}
              type="indented"
            />
            <ResultRow
              label="Elderly Support Portion"
              value={formatJPY(results.nhiElderlySupportPortion ?? 0)}
              type="indented"
            />
            {results.nhiLongTermCarePortion !== undefined && results.nhiLongTermCarePortion > 0 && (
              <ResultRow
                label="Long-term Care Portion"
                value={formatJPY(results.nhiLongTermCarePortion)}
                type="indented"
              />
            )}
            <ResultRow 
              label="Annual Premium" 
              value={formatJPY(results.healthInsurance)} 
              type="subtotal" 
            />
          </>
        )}
      </Box>

      {/* Pension Payments */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          {results.isEmploymentIncome ? "Employees' Pension Insurance" : "National Pension"}
          <DetailInfoTooltip
            title="Pension Contribution Details"
            children={<PensionPremiumTableTooltip results={results} />}
          />
        </Typography>
        <ResultRow 
          label="Monthly Contribution" 
          value={formatJPY(Math.round(results.pensionPayments / 12))} 
          type="indented" 
        />
        <ResultRow 
          label="Annual Contribution" 
          value={formatJPY(results.pensionPayments)} 
          type="subtotal" 
        />
      </Box>

      {/* Employment Insurance */}
      {results.isEmploymentIncome && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
            Employment Insurance
            <InfoTooltip
              title="Employment Insurance (雇用保険)"
              children={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Employment Insurance (雇用保険)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Insurance for unemployment and work-related benefits.
                    This amount includes only the employment insurance premium paid by the employee. The rate is applied to your gross salary. The employer also contributes to employment insurance separately.
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    Official Source:
                    <ul>
                      <li>
                        <a href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000108634.html" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                          Employment Insurance Premium Rate (MHLW)
                        </a>
                      </li>
                    </ul>
                  </Box>
                </Box>
              }
            />
          </Typography>
          <ResultRow 
            label={`Monthly Premium (${(employmentInsuranceRate * 100).toFixed(2)}%)`}
            value={formatJPY(Math.round((results.employmentInsurance ?? 0) / 12))} 
            type="indented" 
          />
          <ResultRow 
            label="Annual Premium"
            value={formatJPY(results.employmentInsurance ?? 0)} 
            type="subtotal" 
          />
        </Box>
      )}

      {/* Total */}
      <Box sx={{ mt: 2 }}>
        <ResultRow 
          label={`Monthly ${results.isEmploymentIncome ? 'Total' : 'Average'}`}
          value={formatJPY(Math.round(totalSocialInsurance / 12))} 
          type="total" 
        />
        <ResultRow 
          label="Annual Social Insurance" 
          value={formatJPY(totalSocialInsurance)} 
          type="total" 
        />
      </Box>
    </Box>
  );
};

export default SocialInsuranceTab;
