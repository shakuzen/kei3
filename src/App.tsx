import { useState, useEffect, Suspense, lazy } from 'react'
import { Box, Typography } from '@mui/material'
import ThemeToggle from './components/ThemeToggle'
import { TakeHomeInputForm } from './components/TakeHomeCalculator/InputForm'
import type { TakeHomeInputs, TakeHomeResults } from './types/tax'
import { calculateTaxes } from './utils/taxCalculations'
import { HealthInsuranceProvider, DEFAULT_PROVIDER_REGION } from './types/healthInsurance'
import { NATIONAL_HEALTH_INSURANCE_REGIONS } from './data/nationalHealthInsurance'
import { ALL_EMPLOYEES_HEALTH_INSURANCE_DATA } from './data/employeesHealthInsurance'

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
    prefecture: "Tokyo",
    showDetailedInput: false,
    healthInsuranceProvider: HealthInsuranceProvider.KYOKAI_KENPO.id,
    numberOfDependents: 0
  }

  // State for form inputs
  const [inputs, setInputs] = useState<TakeHomeInputs>(defaultInputs)

  // State for calculation results
  const [results, setResults] = useState<TakeHomeResults | null>(null)

  // Debounce the tax calculation to prevent excessive updates from rapid slider changes
  useEffect(() => {
    const calculateAndSetResults = () => {
      const takeHomePayResults = calculateTaxes(inputs);
      setResults(takeHomePayResults);
    };

    const handler = setTimeout(() => {
      calculateAndSetResults();
    }, 50);

    // Cleanup function: clear the timeout if the effect re-runs before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [inputs]); // Depend on the entire inputs object

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const isCheckbox = type === 'checkbox';
    const isNumber = type === 'number' || type === 'range';

    setInputs(prev => {
      let processedInputValue: string | number | boolean;
      
      if (isCheckbox) {
        processedInputValue = target.checked;
      } else if (isNumber) {
        processedInputValue = parseFloat(value as string) || 0;
      } else {
        // For select and other text-based inputs
        processedInputValue = value;
      }

      const newInputs = {
        ...prev,
        [name]: processedInputValue
      };

      // Cascading updates for health insurance provider and prefecture
      if (name === 'isEmploymentIncome') {
        const isNowEmploymentIncome = processedInputValue as boolean;
        if (isNowEmploymentIncome) {
          newInputs.healthInsuranceProvider = HealthInsuranceProvider.KYOKAI_KENPO.id;
          const providerRegions = Object.keys(ALL_EMPLOYEES_HEALTH_INSURANCE_DATA[newInputs.healthInsuranceProvider] || {});
          newInputs.prefecture = providerRegions.length > 0 ? providerRegions[0] : DEFAULT_PROVIDER_REGION;
        } else {
          newInputs.healthInsuranceProvider = HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.id;
          newInputs.prefecture = NATIONAL_HEALTH_INSURANCE_REGIONS.length > 0 ? NATIONAL_HEALTH_INSURANCE_REGIONS[0] : DEFAULT_PROVIDER_REGION;
        }
      } else if (name === 'healthInsuranceProvider') {
        const newProviderId = processedInputValue as string;
        if (newProviderId === HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.id) {
          newInputs.prefecture = NATIONAL_HEALTH_INSURANCE_REGIONS.length > 0 ? NATIONAL_HEALTH_INSURANCE_REGIONS[0] : DEFAULT_PROVIDER_REGION;
        } else {
          // For employee providers (Kyokai Kenpo, ITS Kenpo, etc.)
          const providerData = ALL_EMPLOYEES_HEALTH_INSURANCE_DATA[newProviderId];
          if (providerData) {
            const providerRegions = Object.keys(providerData);
            newInputs.prefecture = providerRegions.length > 0 ? providerRegions[0] : DEFAULT_PROVIDER_REGION;
          } else {
            newInputs.prefecture = DEFAULT_PROVIDER_REGION;
            console.warn(`Data for employee provider ${newProviderId} not found in ALL_EMPLOYEES_HEALTH_INSURANCE_DATA. Defaulting prefecture.`);
          }
        }
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
          healthInsuranceProvider={inputs.healthInsuranceProvider}
          prefecture={inputs.prefecture}
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
