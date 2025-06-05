import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  useTheme,
  Switch,
  FormControlLabel,
  Tooltip,
  Fade,
  useMediaQuery,
  type SxProps, type Theme
} from '@mui/material';
import type { TakeHomeResults } from '../../types/tax';
import { formatJPY } from '../../utils/formatters';
import InsuranceIcon from '@mui/icons-material/HealthAndSafety';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Extend the results type for the detailed view
interface DetailedTaxResultsProps {
  results: TakeHomeResults & {
    employmentIncomeDeduction?: number;
    taxableIncomeForNationalTax?: number;
    taxableIncomeForResidenceTax?: number;
  };
}

const labelTooltips: Record<string, string> = {
  'Health Insurance': 'Mandatory health insurance contributions.',
  'Pension Payments': 'Employees/National pension system contributions.',
  'Employment Insurance': 'Insurance for unemployment and work-related benefits.',
  'Income Tax': 'Income tax paid to the national government.',
  'Residence Tax': 'Local income tax paid to your local municipality and prefecture.',
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
    label: string;
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
      my: type === 'final' ? (isMobile ? 0.5 : 1) : undefined, // less margin on mobile
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
        {iconMap[label] || null}
        {label}
        {labelTooltips[label] && (
          <Tooltip title={labelTooltips[label]} arrow>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'action.active', ml: 0.5 }} />
          </Tooltip>
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

  const incomeAfterEmploymentDeduction = results.annualIncome - (results.employmentIncomeDeduction ?? 0);
  const incomeBaseForTaxCalc = incomeAfterEmploymentDeduction - totalSocialInsurance;

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
        control={<Switch checked={showDetails} onChange={handleDetailsToggle} size="small" disabled />}
        label={<Typography variant="caption">Show Calculation Details</Typography>}
        sx={{ mt: 0.5, mb: { xs: 1, sm: 1.5 }, color: 'text.secondary', alignSelf: 'flex-start' }}
        title="Detailed breakdown coming soon!"
      />

      <ResultRow label="Annual Income" value={formatJPY(results.annualIncome)} type="header" />
      <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />

      {/* Details Section */}
      <Fade in={showDetails} unmountOnExit>
        <Box>
          {results.isEmploymentIncome && results.employmentIncomeDeduction !== undefined && (
            <>
              <ResultRow label="Employment Income Deduction" value={formatJPY(results.employmentIncomeDeduction)} type="detail" />
              <ResultRow label="Income After Employment Deduction" value={formatJPY(incomeAfterEmploymentDeduction)} type="detail-subtotal" />
              <Divider variant="middle" sx={{ my: 0.5, mx: 2, borderColor: 'rgba(0,0,0,0.05)' }} />
            </>
          )}
        </Box>
      </Fade>

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

        <Fade in={showDetails} unmountOnExit>
          <Box>
            <Divider variant="middle" sx={{ my: 0.5, mx: 2, borderColor: 'rgba(0,0,0,0.05)' }} />
            <ResultRow label="Income Base (after Social Insurance)" value={formatJPY(incomeBaseForTaxCalc)} type="detail-subtotal" />
          </Box>
        </Fade>
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
            {results.taxableIncomeForNationalTax !== undefined && (
              <ResultRow label="Taxable Income (National)" value={formatJPY(results.taxableIncomeForNationalTax)} type="detail-subtotal" sx={{ mt: 0.5 }} />
            )}
          </Box>
        </Fade>
        <ResultRow label="Income Tax" value={formatJPY(results.nationalIncomeTax)} type="indented" />
        <Fade in={showDetails} unmountOnExit>
          <Box>
            {results.taxableIncomeForResidenceTax !== undefined && (
              <ResultRow label="Taxable Income (Residence)" value={formatJPY(results.taxableIncomeForResidenceTax)} type="detail-subtotal" sx={{ mt: 0.5 }} />
            )}
          </Box>
        </Fade>
        <ResultRow label="Residence Tax" value={formatJPY(results.residenceTax)} type="indented" />
        <ResultRow label="Total Taxes" value={formatJPY(totalIncomeTaxes)} type="subtotal" />
      </Box>
      
      {/* Total Deductions */}
      <Box sx={{ mt: { xs: 1, sm: 1.5 } }}>
         <ResultRow label="Total Deductions" value={formatJPY(totalDeductions)} type="total" valuePrefix="- " />
      </Box>
      
      <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />

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

export default TakeHomeResultsDisplay;