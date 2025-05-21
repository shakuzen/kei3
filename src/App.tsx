import { useState, useEffect, Suspense, lazy } from 'react'
import ThemeToggle from './components/ThemeToggle'
import { TakeHomeInputForm } from './components/TakeHomeCalculator/InputForm'
import type { TakeHomeInputs, TakeHomeResults } from './types/tax'
import { calculateTaxes } from './utils/taxCalculations'

// Lazy load components that aren't immediately needed
const TakeHomeResultsDisplay = lazy(() => import('./components/TakeHomeCalculator/TakeHomeResults'))
const TakeHomeChart = lazy(() => import('./components/TakeHomeCalculator/TakeHomeChart'))

function App() {
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setInputs(prev => {
      const newInputs = {
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : type === 'number' || type === 'range'
            ? parseFloat(value) || 0 
            : value
      }

      // Update health insurance provider based on employment income status
      if (name === 'isEmploymentIncome') {
        newInputs.healthInsuranceProvider = (e.target as HTMLInputElement).checked 
          ? 'Kyokai Kenpo' 
          : 'National Health Insurance'
      }

      return newInputs
    })
  }

  // Calculate taxes when inputs change
  useEffect(() => {
    const results = calculateTaxes(inputs.annualIncome, inputs.isEmploymentIncome, inputs.isOver40)
    setResults(results)
  }, [inputs])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Japan Take-Home Pay Calculator</h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TakeHomeInputForm inputs={inputs} onInputChange={handleInputChange} />
        {results && (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
            <TakeHomeResultsDisplay 
              results={results} 
              annualIncome={inputs.annualIncome} 
              isEmploymentIncome={inputs.isEmploymentIncome}
            />
          </Suspense>
        )}
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg mt-8"></div>}>
        <TakeHomeChart 
          currentIncome={inputs.annualIncome}
          isEmploymentIncome={inputs.isEmploymentIncome}
          isOver40={inputs.isOver40}
        />
      </Suspense>

      <footer className="mt-12 mb-8 text-center text-gray-500 dark:text-gray-400 text-sm h-16">
        <p>This calculator provides estimates only. Tax rules and rates may change.</p>
        <p className="mt-1">Consult with a tax professional for accurate advice.</p>
      </footer>
    </div>
  )
}

export default App
