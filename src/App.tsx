import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import ThemeToggle from './components/ThemeToggle'
import { TakeHomeInputForm } from './components/TakeHomeCalculator/InputForm'
import { TakeHomeResultsDisplay } from './components/TakeHomeCalculator/TakeHomeResults'
import { TakeHomeChart } from './components/TakeHomeCalculator/TakeHomeChart'
import type { TakeHomeInputs, TakeHomeResults } from './types/tax'
import { calculateTaxes } from './utils/taxCalculations'
import { currentAndMedianIncomeChartPlugin } from './utils/chartConfig'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  currentAndMedianIncomeChartPlugin // Register our custom plugin
)

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
        {results && <TakeHomeResultsDisplay results={results} annualIncome={inputs.annualIncome} />}
      </div>

      <TakeHomeChart 
        currentIncome={inputs.annualIncome}
        isEmploymentIncome={inputs.isEmploymentIncome}
        isOver40={inputs.isOver40}
      />

      <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>This calculator provides estimates only. Tax rules and rates may change.</p>
        <p className="mt-1">Consult with a tax professional for accurate advice.</p>
      </footer>
    </div>
  )
}

export default App
