import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { TakeHomeResults } from '../../../types/tax';
import { formatJPY } from '../../../utils/formatters';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import InfoTooltip from '../../ui/InfoTooltip';
import { ResultRow } from '../ResultRow';

interface FurusatoNozeiTabProps {
  results: TakeHomeResults;
}

const FurusatoNozeiTab: React.FC<FurusatoNozeiTabProps> = ({ results }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // If no Furusato Nozei data, show a message
  if (!results.furusatoNozei || results.furusatoNozei.limit <= 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <VolunteerActivismIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
          No Furusato Nozei Data Available
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Furusato Nozei calculations are not available for this income level or configuration.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: 'secondary.main',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          fontSize: isMobile ? '1.1rem' : '1.25rem'
        }}
      >
        <VolunteerActivismIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24, color: 'secondary.main' }} />
        Furusato Nozei Details
      </Typography>

      <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 2, color: 'info.contrastText' }}>
        <Typography variant="body2">
          For comprehensive information about Furusato Nozei, see{' '}
          <a 
            href="https://japanfinance.github.io/tax/residence/furusato-nozei/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            this wiki
          </a>.
        </Typography>
      </Box>

      {/* Limit */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          Donation Limit
        </Typography>
        <ResultRow
          label={
            <span>
              Furusato Nozei Limit
              <InfoTooltip
                title="Donation Limit Explanation"
                children={
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      This limit is the maximum donation for which your out-of-pocket cost is only 2,000 yen, based on the input income and other options.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Actual limits may vary depending on your deductions and municipality.
                    </Typography>
                    <Typography variant="body2">
                      If you claim deductions or tax credits not supported by this calculator, this limit will not be accurate for you (it will likely be too high).
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      You can use{' '}
                      <a href="https://kaikei7.com/furusato_nouzei_keisan/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                        kaikei7
                      </a>{' '}
                      for calculations that support virtually all deductions and credits.
                    </Box>
                  </Box>
                }
              />
            </span>
          }
          value={formatJPY(results.furusatoNozei.limit)}
          type="header"
        />
      </Box>

      {/* Tax Reductions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          Tax Reductions (at limit)
        </Typography>
        
        <ResultRow
          label={
            <span>
              Income Tax Reduction
              <InfoTooltip
                title="Income Tax Reduction"
                children={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Income Tax Reduction (Furusato Nozei)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      This reduction is applied to your income tax if you file a tax return (確定申告) for Furusato Nozei. It is applied in the form of a donation deduction that reduces your taxable income.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      If you use the One-Stop Exception system (ワンストップ特例制度), the reduction will instead be applied to your residence tax, not your income tax.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <a href="https://japanfinance.github.io/tax/residence/furusato-nozei/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                        More about Furusato Nozei
                      </a>
                    </Box>
                  </Box>
                }
              />
            </span>
          }
          value={formatJPY(results.furusatoNozei.incomeTaxReduction)}
          type="indented" 
        />
        
        <ResultRow
          label="Residence Tax Reduction"
          value={formatJPY(results.furusatoNozei.residenceTaxReduction)}
          type="indented" 
        />
        
        <ResultRow
          label="Total Tax Reduction"
          value={formatJPY(results.furusatoNozei.incomeTaxReduction + results.furusatoNozei.residenceTaxReduction)}
          type="subtotal" 
        />
      </Box>

      {/* Cost Analysis */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          Cost Analysis (at limit)
        </Typography>
        
        <ResultRow
          label="Donation Amount"
          value={formatJPY(results.furusatoNozei.limit)}
          type="indented" 
        />
        
        <ResultRow
          label="Total Tax Reduction"
          value={formatJPY(-(results.furusatoNozei.incomeTaxReduction + results.furusatoNozei.residenceTaxReduction))}
          type="indented" 
        />
        
        <ResultRow
          label={
            <span>
              Out-of-Pocket Cost
              {results.furusatoNozei.outOfPocketCost > 2200 && (
                <InfoTooltip
                  title="Warning: High Out-of-Pocket Cost"
                  children={
                    <Box>
                      <Typography variant="body2">
                        Your out-of-pocket cost is higher than the expected 2,000 yen. This can happen if your income straddles two tax brackets and you file for Furusato Nozei via a tax return (確定申告).
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                        This issue is avoided if you use the One-Stop Exception system (ワンストップ特例制度).
                      </Typography>
                    </Box>
                  }
                />
              )}
            </span>
          }
          value={
            <Box 
              component="span" 
              sx={{ 
                color: results.furusatoNozei.outOfPocketCost > 2200 ? 'error.main' : 'inherit', 
                fontWeight: results.furusatoNozei.outOfPocketCost > 2200 ? 700 : 500,
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {formatJPY(results.furusatoNozei.outOfPocketCost)}
            </Box>
          }
          type="subtotal"
        />
      </Box>

      {/* Effective Return */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          Effective Return Analysis
        </Typography>
        
        <ResultRow
          label="Net Cost After Tax Reduction"
          value={formatJPY(results.furusatoNozei.outOfPocketCost)}
          type="indented" 
        />
        
        <ResultRow
          label="Effective Return Rate"
          value={`${(((results.furusatoNozei.limit - results.furusatoNozei.outOfPocketCost) / results.furusatoNozei.limit) * 100).toFixed(1)}%`}
          type="indented" 
        />
        
        <ResultRow
          label="Value of Goods Received"
          value={`≈ ${formatJPY(Math.round(results.furusatoNozei.limit * 0.3))}`}
          type="detail" 
        />
        
        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 1, display: 'block' }}>
          * Goods value estimated at 30% of donation amount, as per typical Furusato Nozei return rates.
        </Typography>
      </Box>

      {/* Warning for high out-of-pocket cost */}
      {results.furusatoNozei.outOfPocketCost > 2200 && (
        <Box sx={{ 
          bgcolor: 'error.light', 
          color: 'error.contrastText', 
          p: 2, 
          borderRadius: 2,
          mt: 2
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ Warning: High Out-of-Pocket Cost
          </Typography>
          <Typography variant="body2">
            Your out-of-pocket cost is higher than the expected 2,000 yen. This can happen if your income straddles two tax brackets and you file via a tax return (確定申告).
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
            This issue is avoided if you use the One-Stop Exception system (ワンストップ特例制度).
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FurusatoNozeiTab;
