import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  useTheme 
} from '@mui/material';
import type { TakeHomeResults as TaxResultsType } from '../../types/tax';
import { formatJPY } from '../../utils/formatters';

interface TaxResultsProps {
  results: TaxResultsType
  annualIncome: number
  isEmploymentIncome: boolean
}

const TakeHomeResultsDisplay: React.FC<TaxResultsProps> = ({ results, annualIncome, isEmploymentIncome }) => {
  const theme = useTheme();

  const StatBox = ({ label, value, variant = 'default' }: { label: string; value: string; variant?: 'default' | 'total' | 'takeHome' }) => (
    <Paper 
      elevation={0}
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ mb: 0.5 }}
      >
        {label}
      </Typography>
      <Typography 
        variant={variant === 'takeHome' ? 'h5' : 'h6'} 
        color={variant === 'takeHome' ? 'success.main' : 'text.primary'}
        fontWeight={500}
      >
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        height: '100%',
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Take-Home Pay Breakdown
      </Typography>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
          gap: 2, 
          mb: 3 
        }}
      >
        <StatBox 
          label="National Income Tax" 
          value={formatJPY(results.nationalIncomeTax)} 
        />
        <StatBox 
          label="Residence Tax" 
          value={formatJPY(results.residenceTax)} 
        />
        <StatBox 
          label="Health Insurance" 
          value={formatJPY(results.healthInsurance)} 
        />
        <StatBox 
          label="Pension Payments" 
          value={formatJPY(results.pensionPayments)} 
        />
        {isEmploymentIncome && (
          <StatBox 
            label="Employment Insurance" 
            value={formatJPY(results.employmentInsurance)} 
          />
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ '& > *:not(:last-child)': { mb: 1.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Total Tax and Payments
          </Typography>
          <Typography variant="subtitle1" fontWeight={500}>
            {formatJPY(results.totalTax)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Take-Home Pay
          </Typography>
          <Typography variant="h6" color="success.main" fontWeight={600}>
            {formatJPY(results.takeHomeIncome)}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          pt: 1 
        }}>
          <Typography variant="body2" color="text.secondary">
            Take-Home Pay Percentage
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {((results.takeHomeIncome / annualIncome) * 100).toFixed(1)}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default TakeHomeResultsDisplay