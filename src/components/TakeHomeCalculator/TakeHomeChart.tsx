import React, { useEffect, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
} from 'chart.js'
import { Slider } from '@mui/material'
import type { ChartRange } from '../../types/tax'
import { formatJPY } from '../../utils/formatters'
import { generateChartData, getChartOptions, currentAndMedianIncomeChartPlugin } from '../../utils/chartConfig'

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
  BarController,
  LineController,
  currentAndMedianIncomeChartPlugin
)

interface TaxChartProps {
  currentIncome: number
  isEmploymentIncome: boolean
  isOver40: boolean
}

export const TakeHomeChart: React.FC<TaxChartProps> = ({ currentIncome, isEmploymentIncome, isOver40 }) => {
  const [chartRange, setChartRange] = useState<ChartRange>({
    min: 0,
    max: 10000000 // 10 million yen
  })
  const [chartInstance, setChartInstance] = useState<any>(null)

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

  const chartData = generateChartData(chartRange, isEmploymentIncome, isOver40)

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Take-Home Pay Across Income Levels</h2>
      
      <div className="h-80">
        <Chart 
          type="bar"
          data={chartData}
          options={getChartOptions(chartRange, currentIncome)}
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
            valueLabelFormat={(value) => formatJPY(value)}
            disableSwap
            className="chart-range-slider"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>{formatJPY(chartRange.min)}</span>
          <span>{formatJPY(chartRange.max)}</span>
        </div>
      </div>
    </div>
  )
} 