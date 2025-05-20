import type { ChartRange } from '../types/tax'
import { formatJPY } from './formatters'
import { calculateTaxes } from './taxCalculations'
import type { ChartData, ChartOptions } from 'chart.js'

// Create custom plugin for vertical lines
export const currentAndMedianIncomeChartPlugin = {
  id: 'currentAndMedianIncomeChartPlugin',
  beforeDraw: (chart: any) => {
    if (!chart.data.datasets || !chart.data.datasets.length) return;

    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const { left, right, top, bottom } = chartArea;
    const width = right - left;

    // Get the data from the plugin options
    if (!chart.options?.plugins?.customPlugin?.data) {
      console.error('Custom plugin data not found in chart options');
      return;
    }

    const chartData = chart.options.plugins.customPlugin.data;
    const isDarkMode = document.documentElement.classList.contains('dark');
    const labelBgColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';

    // Draw Your Income line if it exists and is within the chart range
    if (typeof chartData.currentIncomePosition === 'number' && chartData.currentIncomePosition >= 0 && chartData.currentIncomePosition <= 1) {
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
      ctx.fillStyle = labelBgColor;
      ctx.fillRect(yourIncomeX - 60, top + 5, 120, 40);
      ctx.fillStyle = 'rgba(255, 99, 132, 1)';
      ctx.fillText('Your Income', yourIncomeX, top + 20);
      ctx.fillText(formatJPY(chartData.currentIncome), yourIncomeX, top + 35);
      ctx.restore();
    }

    // Draw Median Income line if it exists and is within the chart range
    if (typeof chartData.medianIncomePosition === 'number' && chartData.medianIncomePosition >= 0 && chartData.medianIncomePosition <= 1) {
      const medianIncomeX = left + (width * chartData.medianIncomePosition);
      ctx.save();
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
      ctx.fillText(formatJPY(chartData.medianIncome), medianIncomeX, top + 35);
      ctx.restore();
    }
  }
};

export const generateChartData = (chartRange: ChartRange, isEmploymentIncome: boolean, isOver40: boolean): ChartData<'bar' | 'line'> => {
  // Create income points based on the current range
  const step = 1000000 // 1 million yen
  const numPoints = Math.floor((chartRange.max - chartRange.min) / step) + 1
  const incomePoints = Array.from(
    { length: numPoints },
    (_, i) => chartRange.min + (i * step)
  )

  // Create datasets with proper alignment
  const datasets = [
    {
      label: 'National Income Tax',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(income, isEmploymentIncome, isOver40).nationalIncomeTax
      })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    },
    {
      label: 'Residence Tax',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(income, isEmploymentIncome, isOver40).residenceTax
      })),
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    },
    {
      label: 'Health Insurance',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(income, isEmploymentIncome, isOver40).healthInsurance
      })),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    },
    {
      label: 'Pension Payments',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(income, isEmploymentIncome, isOver40).pensionPayments
      })),
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    },
    {
      label: 'Net Income',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(income, isEmploymentIncome, isOver40).takeHomeIncome
      })),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    },
    {
      label: 'Take-Home Pay %',
      data: incomePoints.map(income => {
        const result = calculateTaxes(income, isEmploymentIncome, isOver40)
        return {
          x: income,
          y: (result.takeHomeIncome / income) * 100
        }
      }),
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
      yAxisID: 'y1',
      borderDash: [5, 5],
      type: 'line' as const,
    }
  ]

  return {
    labels: incomePoints.map(income => formatJPY(income)),
    datasets
  }
}

export const getChartOptions = (chartRange: ChartRange, currentIncome: number): ChartOptions<'bar' | 'line'> => {
  const maxIncome = chartRange.max
  const minIncome = chartRange.min
  const currentIncomePosition = Math.max(0, Math.min(1, (currentIncome - minIncome) / (maxIncome - minIncome)))
  const medianIncomePosition = Math.max(0, Math.min(1, (4330000 - minIncome) / (maxIncome - minIncome)))

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: function(context: any) {
            const income = context[0].parsed.x;
            return `Income: ${formatJPY(income)}`;
          },
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.yAxisID === 'y1') {
                label += context.parsed.y.toFixed(1) + '%';
              } else {
                label += formatJPY(context.parsed.y);
              }
            }
            return label;
          }
        }
      },
      customPlugin: {
        data: {
          currentIncomePosition,
          medianIncomePosition,
          currentIncome,
          medianIncome: 4330000
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
          callback: function(value: any) {
            return `¥${(value / 10000).toFixed(0)}万`;
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
          callback: function(value: any) {
            return formatJPY(value);
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
          callback: function(value: any) {
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
  }
} 