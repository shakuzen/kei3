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
import { Line } from 'react-chartjs-2'
import ThemeToggle from './components/ThemeToggle'
import { Slider } from '@mui/material'

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

    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark');
    const labelBgColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';

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
    // Draw background for better readability
    ctx.fillStyle = labelBgColor;
    ctx.fillRect(yourIncomeX - 60, top + 5, 120, 40);
    ctx.fillStyle = 'rgba(255, 99, 132, 1)';
    ctx.fillText('Your Income', yourIncomeX, top + 20);
    ctx.fillText(formatCurrency(chartData.currentIncome), yourIncomeX, top + 35);

    // Draw Median Income vertical line
    const medianIncomeX = left + (width * chartData.medianIncomePosition);
    ctx.beginPath();
    ctx.moveTo(medianIncomeX, top);
    ctx.lineTo(medianIncomeX, bottom);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 206, 86, 1)';
    ctx.stroke();

    // Add label for Median Income
    ctx.fillStyle = labelBgColor;
    ctx.fillRect(medianIncomeX - 60, top + 5, 120, 40);
    ctx.fillStyle = 'rgba(255, 206, 86, 1)';
    ctx.fillText('Median Income', medianIncomeX, top + 20);
    ctx.fillText(formatCurrency(chartData.medianIncome), medianIncomeX, top + 35);

    ctx.restore();
  }
};

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
  customPlugin // Register our custom plugin
)

// Define types for form inputs
interface TaxInputs {
  annualIncome: number
  isEmploymentIncome: boolean
  isOver40: boolean
  prefecture: string
  showDetailedInput: boolean
  healthInsuranceProvider: string
  numberOfDependents: number
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
    isEmploymentIncome: true,
    isOver40: false,
    prefecture: 'Tokyo',
    showDetailedInput: false,
    healthInsuranceProvider: 'Kyokai Kenpo',
    numberOfDependents: 0
  }

  // State for form inputs
  const [inputs, setInputs] = useState<TaxInputs>(defaultInputs)

  // State for chart range
  const [chartRange, setChartRange] = useState({
    min: 0,
    max: 10000000 // 10 million yen
  })

  // State for calculation results
  const [results, setResults] = useState<TaxResults | null>(null)

  // State for chart data
  const [chartData, setChartData] = useState<any>(null)
  const [chartInstance, setChartInstance] = useState<any>(null)

  // Median income in Japan (approximate)
  const medianIncome = 4330000 // 4.33 million yen

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

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Redraw chart when theme changes
          if (chartInstance) {
            chartInstance.update();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [chartInstance]);

  // Calculate taxes based on inputs (simplified estimation)
  const calculateTaxes = (income: number, isEmploymentIncome: boolean, isOver40: boolean): TaxResults => {
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

    // Residence tax (simplified)
    const residenceTax = income * 0.1

    // Health insurance (simplified)
    // Include nursing care insurance for those over 40
    const healthInsurance = Math.min(income * (isOver40 ? 0.11 : 0.1), 1500000)

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
    // Create income points based on the current range
    const step = 1000000 // 1 million yen
    const numPoints = Math.floor((chartRange.max - chartRange.min) / step) + 1
    const incomePoints = Array.from(
      { length: numPoints },
      (_, i) => chartRange.min + (i * step)
    )

    // Calculate the position of current income and median income on the x-axis
    const maxIncome = chartRange.max
    const minIncome = chartRange.min
    const currentIncomePosition = Math.max(0, Math.min(1, (currentIncome - minIncome) / (maxIncome - minIncome)))
    const medianIncomePosition = Math.max(0, Math.min(1, (medianIncome - minIncome) / (maxIncome - minIncome)))

    // Create datasets with proper alignment
    const datasets = [
      {
        label: 'National Income Tax',
        data: incomePoints.map(income => ({
          x: income,
          y: calculateTaxes(income, inputs.isEmploymentIncome, inputs.isOver40).nationalIncomeTax
        })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
        type: 'bar',
        stack: 'stack0',
      },
      {
        label: 'Residence Tax',
        data: incomePoints.map(income => ({
          x: income,
          y: calculateTaxes(income, inputs.isEmploymentIncome, inputs.isOver40).residenceTax
        })),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        yAxisID: 'y',
        type: 'bar',
        stack: 'stack0',
      },
      {
        label: 'Health Insurance',
        data: incomePoints.map(income => ({
          x: income,
          y: calculateTaxes(income, inputs.isEmploymentIncome, inputs.isOver40).healthInsurance
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
        type: 'bar',
        stack: 'stack0',
      },
      {
        label: 'Pension Payments',
        data: incomePoints.map(income => ({
          x: income,
          y: calculateTaxes(income, inputs.isEmploymentIncome, inputs.isOver40).pensionPayments
        })),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        yAxisID: 'y',
        type: 'bar',
        stack: 'stack0',
      },
      {
        label: 'Net Income',
        data: incomePoints.map(income => ({
          x: income,
          y: calculateTaxes(income, inputs.isEmploymentIncome, inputs.isOver40).netIncome
        })),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        yAxisID: 'y',
        type: 'bar',
        stack: 'stack0',
      },
      {
        label: 'Take-Home Pay %',
        data: incomePoints.map(income => {
          const result = calculateTaxes(income, inputs.isEmploymentIncome, inputs.isOver40)
          return {
            x: income,
            y: (result.netIncome / income) * 100
          }
        }),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        yAxisID: 'y1',
        borderDash: [5, 5],
        type: 'line',
      }
    ]

    return {
      datasets,
      currentIncomePosition,
      medianIncomePosition,
      currentIncome,
      medianIncome
    }
  }

  // Calculate taxes and update chart when inputs change
  useEffect(() => {
    const results = calculateTaxes(inputs.annualIncome, inputs.isEmploymentIncome, inputs.isOver40)
    setResults(results)
    setChartData(generateChartData(inputs.annualIncome))
  }, [inputs, chartRange])

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
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isEmploymentIncome"
                checked={inputs.isEmploymentIncome}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Employment Income</span>
            </label>

            <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {inputs.isEmploymentIncome ? 'Gross Annual Employment Income (¥)' : 'Net Annual Income (Business income, etc.) (¥)'}
            </label>
            <input
              type="number"
              id="annualIncome"
              name="annualIncome"
              step="10000"
              value={inputs.annualIncome}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <input
              type="range"
              id="annualIncomeSlider"
              name="annualIncome"
              min="200000"
              max="20000000"
              step="10000"
              value={inputs.annualIncome}
              onChange={handleInputChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>¥200,000</span>
              <span>¥10M</span>
              <span>¥20M</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center group relative">
              <input
                type="checkbox"
                name="isOver40"
                checked={inputs.isOver40}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">40 years or older</span>
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:text-gray-600 dark:focus:text-gray-200"
                aria-label="More information about age requirement"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block group-focus-within:block bg-gray-800 text-white text-xs rounded p-2 w-64 z-10">
                This includes nursing care insurance premiums in your health insurance cost calculation
              </div>
            </label>
          </div>

          {/* Detailed Input Section */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setInputs(prev => ({ ...prev, showDetailedInput: !prev.showDetailedInput }))}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <span>Detailed Input</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ml-1 transform transition-transform ${inputs.showDetailedInput ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {inputs.showDetailedInput && (
              <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="mb-4">
                  <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prefecture
                  </label>
                  <select
                    id="prefecture"
                    name="prefecture"
                    value={inputs.prefecture}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                  >
                    <option value="Tokyo">Tokyo</option>
                    <option value="Osaka">Osaka</option>
                    <option value="Kyoto">Kyoto</option>
                    <option value="Hokkaido">Hokkaido</option>
                    <option value="Fukuoka">Fukuoka</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="healthInsuranceProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Health Insurance Provider
                  </label>
                  <select
                    id="healthInsuranceProvider"
                    name="healthInsuranceProvider"
                    value={inputs.healthInsuranceProvider}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                  >
                    <option value="Kyokai Kenpo">Kyokai Kenpo (Employee Health Insurance)</option>
                    <option value="National Health Insurance">National Health Insurance</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {inputs.isEmploymentIncome 
                      ? 'Automatically set to Kyokai Kenpo for employment income'
                      : 'Automatically set to National Health Insurance for non-employment income'}
                  </p>
                </div>

                <div className="mb-4">
                  <label htmlFor="numberOfDependents" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Dependents
                  </label>
                  <input
                    type="number"
                    id="numberOfDependents"
                    name="numberOfDependents"
                    value={inputs.numberOfDependents}
                    onChange={handleInputChange}
                    disabled
                    min="0"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Dependent calculations will be implemented in a future update
                  </p>
                </div>
              </div>
            )}
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
                  <p className="text-gray-700 dark:text-gray-300">Take-Home Pay Percentage</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {((results.netIncome / inputs.annualIncome) * 100).toFixed(1)}%
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
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                      title: function(context) {
                        const income = context[0].parsed.x;
                        return `Income: ${formatCurrency(income)}`;
                      },
                      label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed.y !== null) {
                          if (context.dataset.yAxisID === 'y1') {
                            label += context.parsed.y.toFixed(1) + '%';
                          } else {
                            label += formatCurrency(context.parsed.y);
                          }
                        }
                        return label;
                      }
                    }
                  },
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
                  x: {
                    type: 'linear',
                    grid: {
                      offset: false
                    },
                    ticks: {
                      align: 'center',
                      callback: function(value) {
                        return `¥${(value as number / 10000).toFixed(0)}万`;
                      }
                    },
                    min: chartRange.min,
                    max: chartRange.max,
                    offset: false
                  },
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value as number);
                      }
                    }
                  },
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    min: 0,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  }
                },
                elements: {
                  point: {
                    radius: 3,
                  },
                  bar: {
                    borderWidth: 0
                  }
                }
              }}
              ref={(ref) => setChartInstance(ref)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center">
              <span className="h-3 w-0.5 bg-red-500 mr-1"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Your Income</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-0.5 bg-yellow-400 mr-1"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Median Income</span>
            </div>
          </div>

          {/* Chart Range Controls */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chart Income Range
            </label>
            <div className="px-2">
              <Slider
                min={0}
                max={100000000}
                step={1000000}
                value={[chartRange.min, chartRange.max]}
                onChange={(_, newValue) => {
                  if (Array.isArray(newValue)) {
                    setChartRange({
                      min: newValue[0],
                      max: newValue[1]
                    });
                  }
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatCurrency(value)}
                disableSwap
                className="chart-range-slider"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>{formatCurrency(chartRange.min)}</span>
              <span>{formatCurrency(chartRange.max)}</span>
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
