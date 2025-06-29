import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { TakeHomeResults } from '../../../types/tax';
import { formatJPY } from '../../../utils/formatters';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DetailInfoTooltip from '../../ui/DetailInfoTooltip';
import { ResultRow } from '../ResultRow';

interface TaxesTabProps {
  results: TakeHomeResults;
}

// Reusable tooltip content for employment income deduction
const EmploymentIncomeDeductionTooltip: React.FC = () => (
  <Box>
    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
      2025 Employment Income Deduction Table
    </Typography>
    <Box
      component="table"
      sx={{
        borderCollapse: 'collapse',
        width: '100%',
        fontSize: '0.95em',
        '& td': {
          padding: '2px 6px'
        },
        '& th': {
          borderBottom: '1px solid #ccc',
          padding: '2px 6px',
          textAlign: 'left'
        }
      }}
    >
      <thead>
        <tr>
          <th>Gross Employment Income (¥)</th>
          <th>Deduction Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Up to 1,900,000</td>
          <td>650,000</td>
        </tr>
        <tr>
          <td>1,900,001 – 3,600,000</td>
          <td>30% of income + 80,000</td>
        </tr>
        <tr>
          <td>3,600,001 – 6,600,000</td>
          <td>20% of income + 440,000</td>
        </tr>
        <tr>
          <td>6,600,001 – 8,500,000</td>
          <td>10% of income + 1,100,000</td>
        </tr>
        <tr>
          <td>8,500,001 and above</td>
          <td>1,950,000 (max)</td>
        </tr>
      </tbody>
    </Box>
    <Box sx={{ mt: 1 }}>
      Official Sources:
      <ul>
        <li>
          <a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
            No.1410 給与所得控除 - NTA
          </a>
        </li>
        <li>
          <a href="https://www.nta.go.jp/users/gensen/2025kiso/index.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
            令和７年度税制改正による所得税の基礎控除の見直し等について - NTA
          </a>
        </li>
        <li>
          <a href="https://www.city.yokohama.lg.jp/kurashi/koseki-zei-hoken/zeikin/y-shizei/kojin-shiminzei-kenminzei/R7kaisei.html" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
            令和７年度税制改正（いわゆる年収の壁への対応）の概要 - Yokohama City
          </a>
        </li>
      </ul>
    </Box>
  </Box>
);

const TaxesTab: React.FC<TaxesTabProps> = ({ results }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const totalSocialInsurance = results.healthInsurance + results.pensionPayments + (results.employmentInsurance ?? 0);
  const totalTaxes = results.nationalIncomeTax + results.residenceTax.totalResidenceTax;

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: 'warning.main',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          fontSize: isMobile ? '1.1rem' : '1.25rem'
        }}
      >
        <AccountBalanceIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24, color: 'warning.main' }} />
        Tax Calculation Details
      </Typography>

      {/* Income Overview */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          Income Overview
        </Typography>
        <ResultRow label={results.isEmploymentIncome ? "Gross Employment Income" : "Net Annual Income"} value={formatJPY(results.annualIncome)} type="header" />
        {results.isEmploymentIncome && results.netEmploymentIncome !== undefined && (
          <ResultRow 
            label={
              <span>
                Net Employment Income
                <DetailInfoTooltip 
                  title="Employment Income Deduction Table"
                  children={<EmploymentIncomeDeductionTooltip />} 
                />
              </span>
            }
            value={formatJPY(results.netEmploymentIncome)} 
            type="indented" 
          />
        )}
      </Box>

      {/* Income Tax Calculation */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          Income Tax Calculation
        </Typography>
        <ResultRow label="Starting Income" value={formatJPY(results.netEmploymentIncome ?? results.annualIncome)} type="indented" />
        
        <ResultRow 
          label={
            <span>
              Basic Deduction
              <DetailInfoTooltip
                title="National Income Tax Basic Deduction"
                children={
                  <Box sx={{ minWidth: { xs: 0, sm: 320 }, maxWidth: { xs: '100vw', sm: 420 } }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      National Income Tax Basic Deduction (2025)
                    </Typography>
                    <Box
                      component="table"
                      sx={{
                        width: '100%',
                        fontSize: '0.95em',
                        borderCollapse: 'collapse',
                        '& td': {
                          padding: '2px 6px'
                        },
                        '& th': {
                          borderBottom: '1px solid #ccc',
                          padding: '2px 6px',
                          textAlign: 'left'
                        }
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Net Income (¥)</th>
                          <th>Deduction Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Up to 1,320,000</td>
                          <td>950,000</td>
                        </tr>
                        <tr>
                          <td>Up to 3,360,000</td>
                          <td>880,000</td>
                        </tr>
                        <tr>
                          <td>Up to 4,890,000</td>
                          <td>680,000</td>
                        </tr>
                        <tr>
                          <td>Up to 6,550,000</td>
                          <td>630,000</td>
                        </tr>
                        <tr>
                          <td>Up to 23,500,000</td>
                          <td>580,000</td>
                        </tr>
                        <tr>
                          <td>Up to 24,000,000</td>
                          <td>480,000</td>
                        </tr>
                        <tr>
                          <td>Up to 24,500,000</td>
                          <td>320,000</td>
                        </tr>
                        <tr>
                          <td>Up to 25,000,000</td>
                          <td>160,000</td>
                        </tr>
                        <tr>
                          <td>Over 25,000,000</td>
                          <td>0</td>
                        </tr>
                      </tbody>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      Official Sources (NTA):
                      <ul>
                        <li>
                          <a href="https://www.nta.go.jp/users/gensen/2025kiso/index.htm#a-01" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                            令和７年度税制改正による所得税の基礎控除の見直し等について
                          </a>
                        </li>
                        <li>
                          <a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                            No.1199 基礎控除
                          </a>
                        </li>
                      </ul>
                    </Box>
                  </Box>
                }
              />
            </span>
          }
          value={formatJPY(-(results.nationalIncomeTaxBasicDeduction ?? 0))} 
          type="detail" 
        />
        
        {results.dcPlanContributions > 0 && (
          <ResultRow 
            label={
              <span>
                iDeCo/Corp DC Deduction
                <DetailInfoTooltip
                  title="iDeCo and Corporate DC Contributions (小規模企業共済等掛金控除)"
                  children={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Small Enterprise Mutual Aid Contribution Deduction
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Contributions to iDeCo (individual defined contribution pension) and corporate defined contribution plans reduce your taxable income for income tax and residence tax.
                        Employer contributions cannot be included in this deduction.
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        Official Sources:
                        <ul>
                            <li>
                            <a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontSize: '0.95em' }}>
                              小規模企業共済等掛金控除 (NTA)
                            </a>
                            </li>
                            <li>
                            <a href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/nenkin/nenkin/kyoshutsu/gaiyou.html" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontSize: '0.95em' }}>
                              確定拠出年金制度の概要 (MHLW)
                            </a>
                            </li>
                        </ul>
                      </Box>
                    </Box>
                  }
                />
              </span>
            } 
            value={formatJPY(-results.dcPlanContributions)} 
            type="detail" 
          />
        )}
        
        <ResultRow label="Social Insurance Deduction" value={formatJPY(-totalSocialInsurance)} type="detail" />
        
        {results.taxableIncomeForNationalIncomeTax !== undefined && (
          <ResultRow 
            label={
              <span>
                Taxable Income
                <DetailInfoTooltip
                  title="Taxable Income for National Income Tax"
                  children={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Taxable Income = Net Income - Social Insurance Deduction - Basic Deduction - Other Deductions
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        Official Sources:
                        <ul>
                          <li>
                            <a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                              所得税のしくみ (NTA)
                            </a>
                          </li>
                        </ul>
                      </Box>
                    </Box>
                  }
                />
              </span>
            }
            value={formatJPY(results.taxableIncomeForNationalIncomeTax)} type="detail-subtotal" sx={{ mt: 0.5 }} />
        )}
        
        <ResultRow 
          label="Income Tax" 
          value={formatJPY(results.nationalIncomeTax)} 
          type="subtotal" 
        />
      </Box>

      {/* Residence Tax Calculation */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          Residence Tax Calculation
        </Typography>
        <ResultRow label="Starting Income" value={formatJPY(results.netEmploymentIncome ?? results.annualIncome)} type="indented" />
        
        <ResultRow 
          label={
            <span>
              Basic Deduction
              <DetailInfoTooltip
                title="Residence Tax Basic Deduction"
                children={
                  <Box sx={{ minWidth: { xs: 0, sm: 320 }, maxWidth: { xs: '100vw', sm: 420 } }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Residence Tax Basic Deduction (2025)
                    </Typography>
                    <Box
                      component="table"
                      sx={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        fontSize: '0.95em',
                        '& td': {
                          padding: '2px 6px'
                        },
                        '& th': {
                          borderBottom: '1px solid #ccc',
                          padding: '2px 6px',
                          textAlign: 'left'
                        }
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Net Income (¥)</th>
                          <th>Deduction Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Up to 24,000,000</td>
                          <td>430,000</td>
                        </tr>
                        <tr>
                          <td>24,000,001 - 24,500,000</td>
                          <td>290,000</td>
                        </tr>
                        <tr>
                          <td>24,500,001 - 25,000,000</td>
                          <td>150,000</td>
                        </tr>
                        <tr>
                          <td>Over 25,000,000</td>
                          <td>0</td>
                        </tr>
                      </tbody>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <a href="https://www.city.yokohama.lg.jp/kurashi/koseki-zei-hoken/zeikin/y-shizei/kojin-shiminzei-kenminzei/kaisei/R3zeiseikaisei.html#4" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                        Official Source (Yokohama City)
                      </a>
                    </Box>
                  </Box>
                }
              />
            </span>
          }
          value={formatJPY(-(results.residenceTaxBasicDeduction ?? 0))} 
          type="detail" 
        />
        
        <ResultRow label="Social Insurance Deduction" value={formatJPY(-totalSocialInsurance)} type="detail" />
        
        {results.taxableIncomeForResidenceTax !== undefined && (
          <ResultRow 
            label={
              <span>
                Taxable Income
                <DetailInfoTooltip
                  title="Taxable Income for Residence Tax"
                  children={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Taxable Income = Net Income - Social Insurance Deduction - Basic Deduction - Other Deductions
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <a href="https://www.tax.metro.tokyo.lg.jp/kazei/life/kojin_ju" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                          個人住民税 (Tokyo Bureau of Taxation)
                        </a>
                      </Box>
                    </Box>
                  }
                />
              </span>
            }
            value={formatJPY(results.taxableIncomeForResidenceTax)} type="detail-subtotal" sx={{ mt: 0.5 }} />
        )}
        
        <ResultRow 
          label="Residence Tax" 
          value={formatJPY(results.residenceTax.totalResidenceTax)} 
          type="subtotal" 
        />
      </Box>

      {/* Total */}
      <Box sx={{ mt: 3 }}>
        <ResultRow 
          label="Total Taxes" 
          value={formatJPY(totalTaxes)} 
          type="total" 
        />
        <ResultRow 
          label="Total as % of Income" 
          value={`${((totalTaxes / results.annualIncome) * 100).toFixed(2)}%`} 
          type="detail" 
        />
        <ResultRow 
          label="Monthly Total" 
          value={formatJPY(Math.round(totalTaxes / 12))} 
          type="detail" 
        />
      </Box>
    </Box>
  );
};

export default TaxesTab;
