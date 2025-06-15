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
  const totalIncomeTaxes = results.nationalIncomeTax + results.residenceTax;
  const totalDeductions = results.totalTax; // results.totalTax is the sum of all taxes and social insurance payments
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
        <ResultRow label="Health Insurance" value={formatJPY(results.healthInsurance)} type="indented" />
        <ResultRow label="Pension Payments" value={formatJPY(results.pensionPayments)} type="indented" />
        {results.isEmploymentIncome && (
          <ResultRow label="Employment Insurance" value={formatJPY(results.employmentInsurance ?? 0)} type="indented" />
        )}
        <ResultRow label="Total Social Insurance" value={formatJPY(totalSocialInsurance)} type="subtotal" />
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
                        <table style={{ width: '100%', fontSize: '0.95em' }}>
                          <thead>
                            <tr>
                              <th style={{ borderBottom: '1px solid #ccc', padding: '2px 6px', textAlign: 'left' }}>Net Income (¥)</th>
                              <th style={{ borderBottom: '1px solid #ccc', padding: '2px 6px', textAlign: 'left' }}>Deduction Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 1,320,000</td>
                              <td style={{ padding: '2px 6px' }}>950,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 3,360,000</td>
                              <td style={{ padding: '2px 6px' }}>880,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 4,890,000</td>
                              <td style={{ padding: '2px 6px' }}>680,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 6,550,000</td>
                              <td style={{ padding: '2px 6px' }}>630,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 23,500,000</td>
                              <td style={{ padding: '2px 6px' }}>580,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 24,000,000</td>
                              <td style={{ padding: '2px 6px' }}>480,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 24,500,000</td>
                              <td style={{ padding: '2px 6px' }}>320,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 25,000,000</td>
                              <td style={{ padding: '2px 6px' }}>160,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Over 25,000,000</td>
                              <td style={{ padding: '2px 6px' }}>0</td>
                            </tr>
                          </tbody>
                        </table>
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
          </Box>
        </Fade>
        <ResultRow label="Income Tax" value={formatJPY(results.nationalIncomeTax)} type="indented" />
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
                        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.95em' }}>
                          <thead>
                            <tr>
                              <th style={{ borderBottom: '1px solid #ccc', padding: '2px 6px', textAlign: 'left' }}>Net Income (¥)</th>
                              <th style={{ borderBottom: '1px solid #ccc', padding: '2px 6px', textAlign: 'left' }}>Deduction Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Up to 24,000,000</td>
                              <td style={{ padding: '2px 6px' }}>430,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>24,000,001 - 24,500,000</td>
                              <td style={{ padding: '2px 6px' }}>290,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>24,500,001 - 25,000,000</td>
                              <td style={{ padding: '2px 6px' }}>150,000</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '2px 6px' }}>Over 25,000,000</td>
                              <td style={{ padding: '2px 6px' }}>0</td>
                            </tr>
                          </tbody>
                        </table>
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
        <ResultRow label="Residence Tax" value={formatJPY(results.residenceTax)} type="indented" />
        <ResultRow label="Total Taxes" value={formatJPY(totalIncomeTaxes)} type="subtotal" />
      </Box>
      
      {/* Total Deductions */}
      <Box>
         <ResultRow label="Total Deductions" value={formatJPY(totalDeductions)} type="total" valuePrefix="- " />
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
                whiteSpace: 'nowrap', // Prevents breaking inside the percentage
              }}
            >
              ({takeHomePercentage})
            </Box>
          </Box>
        }
        type="final"
      />
    </Paper>
  );
};

// Reusable tooltip content for employment income deduction
const EmploymentIncomeDeductionTooltip: React.FC = () => (
  <Box>
    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
      2025 Employment Income Deduction Table
    </Typography>
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.95em' }}>
      <thead>
        <tr>
          <th style={{ borderBottom: '1px solid #ccc', padding: '2px 6px', textAlign: 'left' }}>Gross Employment Income (¥)</th>
          <th style={{ borderBottom: '1px solid #ccc', padding: '2px 6px', textAlign: 'left' }}>Deduction Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: '2px 6px' }}>Up to 1,900,000</td>
          <td style={{ padding: '2px 6px' }}>650,000</td>
        </tr>
        <tr>
          <td style={{ padding: '2px 6px' }}>1,900,001 – 3,600,000</td>
          <td style={{ padding: '2px 6px' }}>30% of income + 80,000</td>
        </tr>
        <tr>
          <td style={{ padding: '2px 6px' }}>3,600,001 – 6,600,000</td>
          <td style={{ padding: '2px 6px' }}>20% of income + 440,000</td>
        </tr>
        <tr>
          <td style={{ padding: '2px 6px' }}>6,600,001 – 8,500,000</td>
          <td style={{ padding: '2px 6px' }}>10% of income + 1,100,000</td>
        </tr>
        <tr>
          <td style={{ padding: '2px 6px' }}>8,500,001 and above</td>
          <td style={{ padding: '2px 6px' }}>1,950,000 (max)</td>
        </tr>
      </tbody>
    </table>
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
