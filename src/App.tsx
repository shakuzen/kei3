import { useState, useEffect, Suspense, lazy } from 'react'
import { Box, Typography } from '@mui/material'
import ThemeToggle from './components/ThemeToggle'
import { TakeHomeInputForm } from './components/TakeHomeCalculator/InputForm'
import type { TakeHomeInputs, TakeHomeResults } from './types/tax'
import { calculateTaxes } from './utils/taxCalculations'

// Lazy load components that aren't immediately needed
const TakeHomeResultsDisplay = lazy(() => import('./components/TakeHomeCalculator/TakeHomeResults'))
const TakeHomeChart = lazy(() => import('./components/TakeHomeCalculator/TakeHomeChart'))

interface AppProps {
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
}

function App({ mode, toggleColorMode }: AppProps) {
  // Default values for the form
  const defaultInputs: TakeHomeInputs = {
    annualIncome: 5000000, // 5 million yen
    isEmploymentIncome: true,
    isOver40: false,
    prefecture: 'Tokyo',
    showDetailedInput: false,
    healthInsuranceProvider: 'Kyokai Kenpo',
    numberOfDependents: 0
  }

  // State for form inputs
  const [inputs, setInputs] = useState<TakeHomeInputs>(defaultInputs)

  // State for calculation results
  const [results, setResults] = useState<TakeHomeResults | null>(null)

  // Debounce the tax calculation to prevent excessive updates from rapid slider changes
  useEffect(() => {
    const calculateAndSetResults = () => {
      // console.log('Debounced: Calculating taxes with income:', inputs.annualIncome); // Optional: for debugging
      const takeHomePayResults = calculateTaxes(inputs.annualIncome, inputs.isEmploymentIncome, inputs.isOver40);
      setResults(takeHomePayResults);
    };

    const handler = setTimeout(() => {
      calculateAndSetResults();
    }, 50);

    // Cleanup function: clear the timeout if the effect re-runs before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [inputs.annualIncome, inputs.isEmploymentIncome, inputs.isOver40]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const isCheckbox = type === 'checkbox';
    const isRadio = type === 'radio';
    const isNumber = type === 'number' || type === 'range';

    setInputs(prev => {
      let newValue: string | number | boolean;
      
      if (isCheckbox) {
        newValue = target.checked;
      } else if (isRadio) {
        // For radio buttons, the value comes as a string 'true' or 'false'
        newValue = value === 'true';
      } else if (isNumber) {
        newValue = parseFloat(value as string) || 0;
      } else {
        newValue = value;
      }

      const newInputs = {
        ...prev,
        [name]: newValue
      };

      // Update health insurance provider based on employment income status
      if (name === 'isEmploymentIncome') {
        newInputs.healthInsuranceProvider = target.checked 
          ? 'Kyokai Kenpo' 
          : 'National Health Insurance';
      }

      return newInputs;
    });
  }

  return (
    <Box sx={{
      maxWidth: 1536, // max-w-6xl equivalent
      mx: 'auto',
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 4, sm: 6, md: 8 },
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary',
      overflowX: 'hidden',
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: { xs: 4, sm: 6, md: 8 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        '& h1': {
          fontSize: { xs: '1.75rem', sm: '2rem' },
          lineHeight: 1.2
        }
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold', 
          textAlign: { xs: 'center', sm: 'left' },
        }}>
          Japan Take-Home Pay Calculator
        </Typography>
        <ThemeToggle mode={mode} toggleColorMode={toggleColorMode} />
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: { xs: 3, md: 4 },
        width: '100%',
        '& > *': {
          minWidth: 0, // Prevent overflow issues
        }
      }}>
        <TakeHomeInputForm inputs={inputs} onInputChange={handleInputChange} />
        {results && (
          <Suspense fallback={
            <Box sx={{
              height: 256,
              borderRadius: 1,
              bgcolor: 'action.hover',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }} />
          }>
            <TakeHomeResultsDisplay 
              results={results} 
              annualIncome={inputs.annualIncome} 
              isEmploymentIncome={inputs.isEmploymentIncome}
            />
          </Suspense>
        )}
      </Box>

      <Suspense fallback={
        <Box sx={{
          height: 384,
          mt: 4,
          borderRadius: 1,
          bgcolor: 'action.hover',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }} />
      }>
        <TakeHomeChart 
          currentIncome={inputs.annualIncome}
          isEmploymentIncome={inputs.isEmploymentIncome}
          isOver40={inputs.isOver40}
        />
      </Suspense>

      <Box sx={{
        mt: 12,
        mb: 8,
        textAlign: 'center',
        color: 'text.secondary'
      }}>
        <p>This calculator provides estimates only. Tax rules and rates may change.</p>
        <p className="mt-1">Consult with a tax professional for accurate advice.</p>
      </Box>
    </Box>
  )
}

export default App
