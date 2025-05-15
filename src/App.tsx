import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import ThemeToggle from './components/ThemeToggle'

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0
  }).format(amount)
}

// Create custom plugin for vertical lines
const customPlugin = {
  id: 'customPlugin',
  beforeDraw: (chart: any) => {
    if (!chart.data.datasets || !chart.data.datasets.length) return;

    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const { left, right, top, bottom } = chartArea;
    const width = right - left;

    // Get the data from the plugin options
    if (!chart.options || !chart.options.plugins || !chart.options.plugins.customPlugin || !chart.options.plugins.customPlugin.data) {
      console.error('Custom plugin data not found in chart options');
      return;
    }

    const chartData = chart.options.plugins.customPlugin.data;

    if (!chartData.currentIncomePosition || !chartData.medianIncomePosition) {
      console.error('currentIncomePosition or medianIncomePosition not found in custom plugin data');
      return;
    }

    // Draw Your Income vertical line
    const yourIncomeX = left + (width * chartData.currentIncomePosition);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(yourIncomeX, top);
    ctx.lineTo(yourIncomeX, bottom);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 99, 132, 1)';
    ctx.stroke();

    // Add label for Your Income
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 99, 132, 1)';
    ctx.fillText('Your Income', yourIncomeX, top - 10);
    ctx.fillText(formatCurrency(chartData.currentIncome), yourIncomeX, top - 25);

    // Draw Median Income vertical line
    const medianIncomeX = left + (width * chartData.medianIncomePosition);
    ctx.beginPath();
    ctx.moveTo(medianIncomeX, top);
    ctx.lineTo(medianIncomeX, bottom);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 206, 86, 1)';
    ctx.stroke();

    // Add label for Median Income
    ctx.fillStyle = 'rgba(255, 206, 86, 1)';
    ctx.fillText('Median Income', medianIncomeX, top - 10);
    ctx.fillText(formatCurrency(chartData.medianIncome), medianIncomeX, top - 25);

    ctx.restore();
  }
};

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  customPlugin // Register our custom plugin
)

// Define types for form inputs
interface TaxInputs {
  annualIncome: number
  dependents: number
  isMarried: boolean
  prefecture: string
  city: string
}

// Define types for tax calculation results
interface TaxResults {
  nationalIncomeTax: number
  residenceTax: number
  healthInsurance: number
  pensionPayments: number
  totalTax: number
  netIncome: number
}

function App() {
  // Default values for the form
  const defaultInputs: TaxInputs = {
    annualIncome: 5000000, // 5 million yen
    dependents: 0,
    isMarried: false,
    prefecture: 'Tokyo',
    city: 'Shibuya'
  }

  // State for form inputs
  const [inputs, setInputs] = useState<TaxInputs>(defaultInputs)

  // State for calculation results
  const [results, setResults] = useState<TaxResults | null>(null)

  // State for chart data
  const [chartData, setChartData] = useState<any>(null)

  // Median income in Japan (approximate)
  const medianIncome = 4330000 // 4.33 million yen

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' || type === 'range'
          ? parseFloat(value) || 0 
          : value
    }))
  }

  // Calculate taxes based on inputs (simplified estimation)
  const calculateTaxes = (income: number, deps: number, married: boolean): TaxResults => {
    // These are simplified calculations for demonstration
    // In a real app, these would be more complex and accurate

    // National income tax (simplified progressive tax)
    let nationalIncomeTax = 0
    if (income <= 1950000) {
      nationalIncomeTax = income * 0.05
    } else if (income <= 3300000) {
      nationalIncomeTax = income * 0.1 - 97500
    } else if (income <= 6950000) {
      nationalIncomeTax = income * 0.2 - 427500
    } else if (income <= 9000000) {
      nationalIncomeTax = income * 0.23 - 636000
    } else if (income <= 18000000) {
      nationalIncomeTax = income * 0.33 - 1536000
    } else if (income <= 40000000) {
      nationalIncomeTax = income * 0.4 - 2796000
    } else {
      nationalIncomeTax = income * 0.45 - 4796000
    }

    // Deductions for dependents and marriage
    const deductions = (deps * 380000) + (married ? 380000 : 0)
    nationalIncomeTax = Math.max(0, nationalIncomeTax - deductions * 0.1)

    // Residence tax (simplified)
    const residenceTax = income * 0.1 - Math.min(deductions, income * 0.1)

    // Health insurance (simplified)
    const healthInsurance = Math.min(income * 0.1, 1500000)

    // Pension payments (simplified)
    const pensionPayments = Math.min(income * 0.09, 800000)

    // Calculate totals
    const totalTax = nationalIncomeTax + residenceTax + healthInsurance + pensionPayments
    const netIncome = income - totalTax

    return {
      nationalIncomeTax,
      residenceTax,
      healthInsurance,
      pensionPayments,
      totalTax,
      netIncome
    }
  }

  // Generate chart data for different income levels
  const generateChartData = (currentIncome: number) => {
    // Create a fixed set of income points for proportional grid spacing
    const incomePoints = Array.from({ length: 11 }, (_, i) => i * 1000000)

    const labels = incomePoints.map(income => 
      `¥${(income / 10000).toFixed(0)}万`
    )

    const nationalTaxData = incomePoints.map(income => 
      calculateTaxes(income, inputs.dependents, inputs.isMarried).nationalIncomeTax
    )

    const residenceTaxData = incomePoints.map(income => 
      calculateTaxes(income, inputs.dependents, inputs.isMarried).residenceTax
    )

    const healthInsuranceData = incomePoints.map(income => 
      calculateTaxes(income, inputs.dependents, inputs.isMarried).healthInsurance
    )

    const pensionData = incomePoints.map(income => 
      calculateTaxes(income, inputs.dependents, inputs.isMarried).pensionPayments
    )

    const netIncomeData = incomePoints.map(income => 
      calculateTaxes(income, inputs.dependents, inputs.isMarried).netIncome
    )

    // Calculate the position of current income and median income on the x-axis
    // This will be used for vertical line annotations
    const maxIncome = incomePoints[incomePoints.length - 1]
    const currentIncomePosition = currentIncome / maxIncome
    const medianIncomePosition = medianIncome / maxIncome

    return {
      labels,
      datasets: [
        {
          label: 'National Income Tax',
          data: nationalTaxData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Residence Tax',
          data: residenceTaxData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Health Insurance',
          data: healthInsuranceData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Pension Payments',
          data: pensionData,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
        },
        {
          label: 'Net Income',
          data: netIncomeData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        }
      ],
      // Store the positions for vertical lines
      currentIncomePosition,
      medianIncomePosition,
      // Store the actual values for tooltips
      currentIncome,
      medianIncome
    }
  }

  // Calculate taxes and update chart when inputs change
  useEffect(() => {
    const results = calculateTaxes(inputs.annualIncome, inputs.dependents, inputs.isMarried)
    setResults(results)
    setChartData(generateChartData(inputs.annualIncome))
  }, [inputs])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Japan Tax Calculator</h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Information</h2>

          <div className="mb-4">
            <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Annual Income (¥)
            </label>
            <input
              type="number"
              id="annualIncome"
              name="annualIncome"
              value={inputs.annualIncome}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <input
              type="range"
              id="annualIncomeSlider"
              name="annualIncome"
              min="0"
              max="20000000"
              step="10000"
              value={inputs.annualIncome}
              onChange={handleInputChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>¥0</span>
              <span>¥10M</span>
              <span>¥20M</span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Dependents
            </label>
            <input
              type="number"
              id="dependents"
              name="dependents"
              min="0"
              value={inputs.dependents}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isMarried"
                checked={inputs.isMarried}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Married</span>
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prefecture
            </label>
            <select
              id="prefecture"
              name="prefecture"
              value={inputs.prefecture}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tokyo">Tokyo</option>
              <option value="Osaka">Osaka</option>
              <option value="Kyoto">Kyoto</option>
              <option value="Hokkaido">Hokkaido</option>
              <option value="Fukuoka">Fukuoka</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={inputs.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tax Calculation Results</h2>

          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">National Income Tax</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(results.nationalIncomeTax)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Residence Tax</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(results.residenceTax)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Health Insurance</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(results.healthInsurance)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pension Payments</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(results.pensionPayments)}</p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 dark:text-gray-300">Total Tax and Payments</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(results.totalTax)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 dark:text-gray-300">Net Income</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(results.netIncome)}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-700 dark:text-gray-300">Effective Tax Rate</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {((results.totalTax / inputs.annualIncome) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tax Breakdown Across Income Levels</h2>
          <div className="h-80">
            <Line 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed.y !== null) {
                          label += formatCurrency(context.parsed.y);
                        }
                        return label;
                      }
                    }
                  },
                  // Pass data to the custom plugin
                  customPlugin: {
                    data: {
                      currentIncomePosition: chartData.currentIncomePosition,
                      medianIncomePosition: chartData.medianIncomePosition,
                      currentIncome: chartData.currentIncome,
                      medianIncome: chartData.medianIncome
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value as number);
                      }
                    }
                  }
                },
                elements: {
                  point: {
                    radius: 3, // All points have the same radius now
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center">
              <span className="h-3 w-0.5 bg-red-500 mr-1"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Your Income (vertical line)</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-0.5 bg-yellow-400 mr-1"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Median Income (vertical line)</span>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>This calculator provides estimates only. Tax rules and rates may change.</p>
        <p className="mt-1">Consult with a tax professional for accurate advice.</p>
      </footer>
    </div>
  )
}

export default App
