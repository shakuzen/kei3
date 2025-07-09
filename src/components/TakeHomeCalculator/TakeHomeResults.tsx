import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  useTheme,
  Switch,
  FormControlLabel,
  Fade,
  useMediaQuery,
  type SxProps, type Theme
} from '@mui/material';
import type { TakeHomeResults } from '../../types/tax';
import { formatJPY } from '../../utils/formatters';
import InsuranceIcon from '@mui/icons-material/HealthAndSafety';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoTooltip from '../ui/InfoTooltip';
import DetailInfoTooltip from '../ui/DetailInfoTooltip';
import { monthlyNationalPensionContribution } from '../../utils/pensionCalculator';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

// Extend the results type for the detailed view
interface DetailedTaxResultsProps {
  results: TakeHomeResults;
}

const labelTooltips: Record<string, string> = {
  'Health Insurance': 'Mandatory health insurance contributions.',
  'Pension Payments': 'Employees/National pension system contributions.',
  'Employment Insurance': 'Insurance for unemployment and work-related benefits.',
  'Income Tax': 'Income tax paid to the national government.',
  'Residence Tax': 'Local income tax paid to your local municipality and prefecture. Note that residence tax is billed in arrears. For example, residents on January 1, 2026 will be billed from June 2026 based on their income in 2025. If your income fluctuates from year to year, consider the effect on your residence tax billed in arrears.',
  'Total Deductions': 'Sum of all taxes and social insurance payments.',
};

const iconMap: Record<string, React.ReactNode> = {
  // 'Health Insurance': <InsuranceIcon fontSize="small" sx={{ color: 'primary.light', mr: 0.5 }} />,
  // 'Pension Payments': <PaymentsIcon fontSize="small" sx={{ color: 'secondary.light', mr: 0.5 }} />,
  // 'Employment Insurance': <AccountBalanceIcon fontSize="small" sx={{ color: 'info.light', mr: 0.5 }} />,
  // 'Income Tax': <AccountBalanceIcon fontSize="small" sx={{ color: 'warning.light', mr: 0.5 }} />,
  // 'Residence Tax': <AccountBalanceIcon fontSize="small" sx={{ color: 'success.light', mr: 0.5 }} />,
};

const TakeHomeResultsDisplay: React.FC<DetailedTaxResultsProps> = ({ results }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Inner component for displaying each row in the breakdown
  const ResultRow = ({
    label,
    value,
    type = 'default',
    valuePrefix,
    sx: rowSxOverride // Allow overriding sx for specific rows
  }: {
    label: string | React.ReactNode;
    value: string | React.ReactNode;
    type?: 'default' | 'indented' | 'subtotal' | 'total' | 'final' | 'header' | 'detail' | 'detail-subtotal';
    valuePrefix?: string;
    sx?: SxProps<Theme>;
  }) => {
    let labelSpecificSx: SxProps<Theme> = {};
    let valueSpecificSx: SxProps<Theme> = {};
    let boxSx: SxProps<Theme> = {
      display: 'flex',
      alignItems: 'center',
      py: isMobile ? 0.15 : 0.6, // reduced vertical padding for mobile
      bgcolor: type === 'final' ? 'rgba(76, 175, 80, 0.07)' : undefined,
      borderRadius: type === 'final' ? 2 : undefined,
      mt: type === 'final' ? (isMobile ? 0.5 : 1) : undefined, // less margin on mobile
    };

    switch (type) {
      case 'header':
        labelSpecificSx = { fontWeight: 500, fontSize: isMobile ? '0.98rem' : '1rem', color: 'text.primary' };
        valueSpecificSx = { fontWeight: 500, fontSize: isMobile ? '0.98rem' : '1rem', color: 'text.primary' };
        boxSx.py = isMobile ? 0.3 : 1.1; // slightly reduced
        break;
      case 'indented':
        labelSpecificSx = { fontSize: '0.95rem', color: 'text.secondary', display: 'flex', alignItems: 'center' };
        valueSpecificSx = { fontSize: '0.95rem', color: 'text.primary' };
        boxSx.pl = theme.spacing(2.5); // Indentation for sub-items
        boxSx.py = isMobile ? 0.18 : 0.6;
        break;
      case 'subtotal':
        labelSpecificSx = { fontSize: '1rem', fontWeight: 500, color: 'primary.main' };
        valueSpecificSx = { fontSize: '1rem', fontWeight: 700, color: 'primary.main' };
        boxSx.pl = theme.spacing(2.5); // Match indentation of items it subtotals
        boxSx.pt = isMobile ? 0.4 : 0.75;
        boxSx.mt = isMobile ? 0.3 : 0.5;
        boxSx.borderTop = `1px solid ${theme.palette.divider}`; // Solid line for emphasis
        break;
      case 'total':
        labelSpecificSx = { fontSize: isMobile ? '1.05rem' : '1.1rem', fontWeight: 600, color: 'text.primary' };
        valueSpecificSx = { fontSize: isMobile ? '1.05rem' : '1.1rem', fontWeight: 700, color: 'error.main' };
        boxSx.py = isMobile ? 0.4 : 1;
        boxSx.mt = isMobile ? 0.3 : 0.5;
        boxSx.borderTop = `2px solid ${theme.palette.divider}`; // Line above total deductions
        break;
      case 'final':
        labelSpecificSx = {
          ...labelSpecificSx,
          fontSize: isMobile ? '1.15rem' : '1.3rem', // Make it larger than total
          fontWeight: 700,
          color: 'success.dark',
          textAlign: 'left',
          minWidth: 0,
          pr: 2,
          flexShrink: 1,
          flexBasis: 'auto',
          width: 'auto',
        };
        valueSpecificSx = {
          ...valueSpecificSx,
          fontSize: isMobile ? '1.15rem' : '1.3rem', // Match label
          fontWeight: 700,
          color: 'success.main',
          textAlign: 'right',
          marginLeft: 'auto',
          minWidth: 0,
          flexShrink: 1,
          flexBasis: 'auto',
          width: 'auto',
          overflowWrap: 'break-word',
          whiteSpace: 'nowrap',
          wordBreak: 'break-word',
          display: 'flex',
          alignItems: 'center',
        };
        boxSx = {
          ...boxSx,
          py: isMobile ? 0.5 : 1.5, // reduced on mobile
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
        };
        break;
      case 'detail':
        labelSpecificSx = { fontSize: '0.8rem', color: 'text.disabled' };
        valueSpecificSx = { fontSize: '0.8rem', color: 'text.secondary', fontWeight: 500 };
        boxSx.pl = theme.spacing(3.5); // Deeper indent for details
        boxSx.py = isMobile ? 0.12 : 0.5;
        break;
      case 'detail-subtotal': // For subtotals within the detailed view
        labelSpecificSx = { fontSize: '0.8rem', fontWeight: 500, color: 'text.disabled' };
        valueSpecificSx = { fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary' };
        boxSx.pl = theme.spacing(3.5); // Match detail indentation
        boxSx.py = isMobile ? 0.12 : 0.5;
        // No border for detail-subtotals to keep it lighter
        break;
      default: // 'default' for percentage row
        labelSpecificSx = { fontSize: '0.95rem', color: 'text.secondary' };
        valueSpecificSx = { fontSize: '0.95rem', fontWeight: 500, color: 'text.primary' };
        break;
    }

    // Merge rowSxOverride after specific type styles have been applied to boxSx
    if (rowSxOverride) {
      boxSx = { ...boxSx, ...rowSxOverride };
    }

    // Responsive: stack label/value vertically on mobile
    const leftColumnLayoutSx: SxProps<Theme> = isMobile
      ? { width: '60%', textAlign: 'left', pr: 1 }
      : { flexBasis: '60%', textAlign: 'left', pr: 2 };
    const rightColumnLayoutSx: SxProps<Theme> = isMobile
      ? { width: '40%', textAlign: 'right' }
      : { flexBasis: '40%', textAlign: 'right' };

    // Add tooltip and icon if available
    const labelContent = (
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
        {iconMap[typeof label === 'string' ? label : ''] || null}
        {label}
        {typeof label === 'string' && labelTooltips[label] && (
          <InfoTooltip title={labelTooltips[label]} />
        )}
      </Box>
    );

    return (
      <Box sx={boxSx}>
        <Typography sx={{ ...leftColumnLayoutSx, ...labelSpecificSx }}>
          {labelContent}
        </Typography>
        <Typography sx={{ ...rightColumnLayoutSx, ...valueSpecificSx }}>
          {valuePrefix}{value}
        </Typography>
      </Box>
    );
  };

  const [showDetails, setShowDetails] = React.useState(false);

  const handleDetailsToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDetails(event.target.checked);
  };

  const totalSocialInsurance = results.healthInsurance + results.pensionPayments + (results.employmentInsurance ?? 0);
  const totalTaxes = results.nationalIncomeTax + results.residenceTax.totalResidenceTax;
  const totalDeductions = totalSocialInsurance + totalTaxes;
  const takeHomePercentage = results.annualIncome > 0 ? `${((results.takeHomeIncome / results.annualIncome) * 100).toFixed(1)}%` : '100%';

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.2, sm: 3 }, // slightly reduced padding on mobile
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        width: '100%',
        mx: 'auto',
      }}
    >
      <Typography variant="h6" component="h2" sx={{ fontSize: { xs: '1.08rem', sm: '1.3rem' }, mb: { xs: 1, sm: 2 }, fontWeight: 700 }}>
        Take-Home Pay Breakdown
      </Typography>
      <FormControlLabel
        control={<Switch checked={showDetails} onChange={handleDetailsToggle} size="small" />}
        label={<Typography variant="caption">Show Calculation Details</Typography>}
        sx={{ mt: 0.5, mb: { xs: 1, sm: 1.5 }, color: 'text.secondary', alignSelf: 'flex-start' }}
        title="Show more detailed breakdown of calculations, including official sources and deduction tables."
      />

      <ResultRow label="Annual Income" value={formatJPY(results.annualIncome)} type="header" />
      <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />

      {/* Social Insurance Section */}
      <Box sx={{ bgcolor: 'rgba(33,150,243,0.03)', borderRadius: 2, px: 1, py: 1, mb: { xs: 0.5, sm: 1 } }}>
        <Typography
          variant="subtitle2"
          sx={{
            mt: { xs: 0.5, sm: 1 }, mb: { xs: 0.5, sm: 1 },
            color: 'primary.main',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}
        >
          <InsuranceIcon sx={{ mr: 1, fontSize: isMobile ? 18 : 20 }} />
          Social Insurance
        </Typography>
        <ResultRow 
          label="Health Insurance" 
          value={
            !isMobile ? 
              `${formatJPY(results.healthInsurance)} (${((results.healthInsurance / results.annualIncome) * 100).toFixed(1)}%)` : 
              formatJPY(results.healthInsurance)
          } 
          type="indented" 
        />
        <Fade in={showDetails} unmountOnExit>
          <Box>
            {!results.isEmploymentIncome && (
              <ResultRow label={
                <span>
                  Monthly Premium
                  <DetailInfoTooltip
                    title="National Pension (国民年金)"
                    children={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          National Basic Pension (2025)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Contributions to the National Pension (国民年金) system are a fixed amount irrespective of income.
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          Official Source:
                          <ul>
                            <li>
                              <a href="https://www.nenkin.go.jp/service/kokunen/hokenryo/hokenryo.html#cms01" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                                国民年金保険料の金額 (Japan Pension Service)
                              </a>
                            </li>
                          </ul>
                        </Box>
                      </Box>
                    }
                  />
                </span>
              } value={formatJPY(monthlyNationalPensionContribution)} type="detail" />
            )}
          </Box>
        </Fade>
        <ResultRow 
          label="Pension Payments" 
          value={
            !isMobile ? 
              `${formatJPY(results.pensionPayments)} (${((results.pensionPayments / results.annualIncome) * 100).toFixed(1)}%)` : 
              formatJPY(results.pensionPayments)
          } 
          type="indented" 
        />
        {results.isEmploymentIncome && (
          <ResultRow 
            label={
              <span>
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
              </span>
            }
            value={
              !isMobile ? 
                `${formatJPY(results.employmentInsurance ?? 0)} (${(((results.employmentInsurance ?? 0) / results.annualIncome) * 100).toFixed(2)}%)` : 
                formatJPY(results.employmentInsurance ?? 0)
            } 
            type="indented" 
          />
        )}
        <ResultRow 
          label="Total Social Insurance" 
          value={
            !isMobile ? 
              `${formatJPY(totalSocialInsurance)} (${((totalSocialInsurance / results.annualIncome) * 100).toFixed(1)}%)` : 
              formatJPY(totalSocialInsurance)
          } 
          type="subtotal" 
        />
      </Box>
      
      {/* Taxes Section */}
      <Box sx={{ bgcolor: 'rgba(255,193,7,0.03)', borderRadius: 2, px: 1, py: 1, mb: { xs: 0.5, sm: 1 } }}>
        <Typography
          variant="subtitle2"
          sx={{
            mt: { xs: 0.5, sm: 1 }, mb: { xs: 0.5, sm: 1 },
            color: 'warning.main',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}
        >
          <AccountBalanceIcon sx={{ mr: 1, fontSize: isMobile ? 18 : 20, color: 'warning.main' }} />
          Taxes
        </Typography>
        <Fade in={showDetails} unmountOnExit>
          <Box>
            <ResultRow label={results.isEmploymentIncome ? "Gross Employment Income" : "Net Annual Income"} value={formatJPY(results.annualIncome)} type="detail" />
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
                type="detail" 
              />
            )}
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
                            Taxable Income = Net Income - Social Insurance Deduction - Basic Deduction
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
            {results.mortgageTaxCredit > 0 && (
              <ResultRow 
                label={
                  <span>
                    Mortgage Tax Credit Applied
                    <DetailInfoTooltip
                      title="Mortgage Tax Credit (住宅ローン控除)"
                      children={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Mortgage Tax Credit (住宅ローン控除)
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            The mortgage tax credit is first applied to income tax, and any remaining credit 
                            can be applied to residence tax up to legal limits (7% of net income, capped at ¥136,500).
                          </Typography>
                          {results.mortgageIncomeTaxCredit && results.mortgageIncomeTaxCredit > 0 && (
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              Applied to income tax: {formatJPY(results.mortgageIncomeTaxCredit)}
                            </Typography>
                          )}
                          {results.mortgageResidenceTaxCredit && results.mortgageResidenceTaxCredit > 0 && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Applied to residence tax: {formatJPY(results.mortgageResidenceTaxCredit)}
                            </Typography>
                          )}
                          <Box sx={{ mt: 1 }}>
                            Official Source:
                            <ul>
                              <li>
                                <a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1211.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '0.95em' }}>
                                  No.1211 住宅借入金等特別控除 (NTA)
                                </a>
                              </li>
                            </ul>
                          </Box>
                        </Box>
                      }
                    />
                  </span>
                }
                value={formatJPY(-results.mortgageTaxCredit)} 
                type="detail" 
              />
            )}
          </Box>
        </Fade>
        <ResultRow 
          label="Income Tax" 
          value={
            !isMobile ? 
              `${formatJPY(results.nationalIncomeTax)} (${((results.nationalIncomeTax / results.annualIncome) * 100).toFixed(1)}%)` : 
              formatJPY(results.nationalIncomeTax)
          } 
          type="indented" 
        />
        <Fade in={showDetails} unmountOnExit>
          <Box>
            <ResultRow label={results.isEmploymentIncome ? "Gross Employment Income" : "Net Annual Income"} value={formatJPY(results.annualIncome)} type="detail" />
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
                type="detail" 
              />
            )}
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
                            Taxable Income = Net Income - Social Insurance Deduction - Basic Deduction
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
          </Box>
        </Fade>
        <ResultRow 
          label="Residence Tax" 
          value={
            !isMobile ? 
              `${formatJPY(results.residenceTax.totalResidenceTax)} (${((results.residenceTax.totalResidenceTax / results.annualIncome) * 100).toFixed(1)}%)` : 
              formatJPY(results.residenceTax.totalResidenceTax)
          } 
          type="indented" 
        />
        <ResultRow 
          label="Total Taxes" 
          value={
            !isMobile ? 
              `${formatJPY(totalTaxes)} (${((totalTaxes / results.annualIncome) * 100).toFixed(1)}%)` : 
              formatJPY(totalTaxes)
          } 
          type="subtotal" 
        />
      </Box>
      
      {/* Total Deductions */}
      <Box>
         <ResultRow 
           label="Total Deductions" 
           value={
             !isMobile ? 
               `${formatJPY(-totalDeductions)} (${((totalDeductions / results.annualIncome) * 100).toFixed(1)}%)` : 
               formatJPY(-totalDeductions)
           } 
           type="total"
         />
      </Box>
      
      <Divider sx={{ borderBottomWidth: 2 }} />

      {/* Net Take-Home Pay */}
      <ResultRow
        label="Take-Home Pay"
        value={
          <Box component="span" sx={{ color: 'success.main', fontWeight: 700 }}>
            {formatJPY(results.takeHomeIncome)}
            <Box
              component="span"
              sx={{
                color: 'success.dark',
                fontWeight: 600,
                ml: 1,
                whiteSpace: 'nowrap',
              }}
            >
              ({takeHomePercentage})
            </Box>
          </Box>
        }
        type="final"
      />

      {/* Furusato Nozei Limit */}
      {results.furusatoNozei !== undefined && results.furusatoNozei.limit > 0 && (
        <Box sx={{ bgcolor: 'rgba(156,39,176,0.07)', borderRadius: 2, px: 1, py: 1, mt: { xs: 0.5, sm: 1 }, mb: { xs: 0.5, sm: 1 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              mt: { xs: 0.5, sm: 1 }, mb: { xs: 0.5, sm: 1 },
              color: 'secondary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              fontSize: isMobile ? '1rem' : '1.1rem'
            }}
          >
            <VolunteerActivismIcon sx={{ mr: 1, fontSize: isMobile ? 18 : 20, color: 'secondary.main' }} />
            Furusato Nozei
          </Typography>
          <Fade in={showDetails} unmountOnExit>
            <Box>
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
                            This reduction is applied to your income tax if you file a tax return (確定申告) for Furusato Nozei. It is applied in the form of a donation deduction that reduces your taxable income. If you use the One-Stop Exception system (ワンストップ特例制度), the reduction will instead be applied to your residence tax, not your income tax.
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
                type="detail" />
              {/* <ResultRow
                label="Residence Tax Donation Reduction"
                value={formatJPY(results.furusatoNozei.residenceTaxDonationBasicDeduction)}
                type="detail" />
              <ResultRow
                label="Residence Tax Special Deduction"
                value={formatJPY(results.furusatoNozei.residenceTaxSpecialDeduction)}
                type="detail" /> */}
              <ResultRow
                label="Residence Tax Reduction"
                value={formatJPY(results.furusatoNozei.residenceTaxReduction)}
                type="detail" />
              <ResultRow
                label="Out-of-Pocket Cost"
                value={
                  <Box component="span" sx={{ color: results.furusatoNozei.outOfPocketCost > 2200 ? 'error.main' : 'inherit', fontWeight: results.furusatoNozei.outOfPocketCost > 2200 ? 700 : 500, display: 'inline-flex', alignItems: 'center' }}>
                    {formatJPY(results.furusatoNozei.outOfPocketCost)}
                    {results.furusatoNozei.outOfPocketCost > 2200 && (
                      <InfoTooltip
                        title="Warning: High Out-of-Pocket Cost"
                        children={
                          <Box>
                            <Typography variant="body2">
                              Your out-of-pocket cost is higher than the expected 2,000 yen. This can happen if your income straddles two tax brackets and you file for Furusato Nozei via a tax return (確定申告).<br />
                              <b>This issue is avoided if you use the One-Stop Exception system (ワンストップ特例制度).</b>
                            </Typography>
                          </Box>
                        }
                      />
                    )}
                  </Box>
                }
                type="detail" />
            </Box>
          </Fade>
          <ResultRow
            label={
              <span>
                Furusato Nozei Limit
                <InfoTooltip
                  icon={results.furusatoNozei.outOfPocketCost > 2200 ? (
                    <svg style={{ color: '#d32f2f', width: 20, height: 20, marginLeft: 4, verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                  ) : undefined}
                  title={
                    results.furusatoNozei.outOfPocketCost > 2200
                      ? `Warning: If your out-of-pocket cost is higher than 2,000 yen, it may be because your income straddles two tax brackets and you file via a tax return (確定申告). This issue is avoided if you use the One-Stop Exception system (ワンストップ特例制度).`
                      : `Furusato Nozei Limit\n\nFor information about Furusato Nozei, see this wiki. This limit is the estimated maximum donation for which your out-of-pocket cost is only 2,000 yen, based on your current income and tax situation. Actual limits may vary depending on your deductions and municipality. If you claim deductions or tax credits not supported by this calculator, this will not be accurate for you. You can use kaikei7 instead.`
                  }
                  children={
                    <Box>
                      For information about Furusato Nozei, see <a href="https://japanfinance.github.io/tax/residence/furusato-nozei/" target="_blank" rel="noopener">this wiki</a>.<br />
                      This limit is the maximum donation for which your out-of-pocket cost is only 2,000 yen, based on the input income and other options.<br />
                      Actual limits may vary depending on your deductions and municipality.<br />
                      If you claim deductions or tax credits or otherwise have a tax situation not supported by this calculator, this limit will not be accurate for you (it will be too high, most likely).<br />
                      You can use <a href="https://kaikei7.com/furusato_nouzei_keisan/" target="_blank" rel="noopener noreferrer">kaikei7</a>, which supports virtually all deductions and credits.<br />
                      {results.furusatoNozei.outOfPocketCost > 2200 && (
                        <Box sx={{ color: 'error.main', fontWeight: 600, mt: 1 }}>
                          Warning: Your out-of-pocket cost is higher than 2,000 yen. This can happen if your income straddles two tax brackets and you file via a tax return (確定申告). This issue is avoided if you use the One-Stop Exception system (ワンストップ特例制度).
                        </Box>
                      )}
                    </Box>
                  }
                />
              </span>
            }
            value={formatJPY(results.furusatoNozei.limit)}
            type="subtotal"
            sx={{ mt: 1, borderRadius: 2 }}
          />
        </Box>
      )}
    </Paper>
  );
};

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

export default TakeHomeResultsDisplay;
