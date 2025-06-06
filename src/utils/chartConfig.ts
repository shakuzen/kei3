import type { ChartRange, TakeHomeInputs } from '../types/tax'
import { formatJPY, formatYenCompact } from './formatters'
import { calculateTaxes } from './taxCalculations'
import type { ChartData, ChartOptions, Chart, TooltipItem, Scale, CoreScaleOptions, Plugin } from 'chart.js'


// Create custom plugin for vertical lines
export const currentAndMedianIncomeChartPlugin: Plugin<'bar' | 'line'> = {
  id: 'currentAndMedianIncomeChartPlugin',
  beforeDraw: (chart: Chart) => {
    if (!chart.data.datasets || !chart.data.datasets.length) return;

    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const { left, right, top, bottom } = chartArea;
    const width = right - left;

    const pluginData = chart.options?.plugins?.customPlugin?.data;

    if (!pluginData) {
      console.error('Custom plugin data not found in chart options');
      return;
    }

    // Draw Your Income line if it exists and is within the chart range
    if (typeof pluginData.currentIncomePosition === 'number' && pluginData.currentIncomePosition >= 0 && pluginData.currentIncomePosition <= 1) {
      const yourIncomeX = left + (width * pluginData.currentIncomePosition);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(yourIncomeX, top);
      ctx.lineTo(yourIncomeX, bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 99, 132, 1)';
      ctx.stroke();

      ctx.restore();
    }

    // Draw Median Income line if it exists and is within the chart range
    if (typeof pluginData.medianIncomePosition === 'number' && pluginData.medianIncomePosition >= 0 && pluginData.medianIncomePosition <= 1) {
      const medianIncomeX = left + (width * pluginData.medianIncomePosition);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(medianIncomeX, top);
      ctx.lineTo(medianIncomeX, bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 206, 86, 1)';
      ctx.stroke();

      ctx.restore();
    }
  }
};

export const generateChartData = (
  chartRange: ChartRange,
  currentInputs: Omit<TakeHomeInputs, 'annualIncome' | 'showDetailedInput' | 'numberOfDependents'> // Chart varies by income, other inputs are fixed for a given chart
): ChartData<'bar' | 'line'> => {

  const createTaxInputsForIncome = (income: number): TakeHomeInputs => ({
    ...currentInputs,
    annualIncome: income,
    showDetailedInput: false, // Not relevant for chart calculation
    numberOfDependents: 0, // Not relevant for chart calculation
  });
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
      label: 'Income Tax',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(createTaxInputsForIncome(income)).nationalIncomeTax
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
        y: calculateTaxes(createTaxInputsForIncome(income)).residenceTax
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
        y: calculateTaxes(createTaxInputsForIncome(income)).healthInsurance
      })),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    },
    {
      label: 'Pension',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(createTaxInputsForIncome(income)).pensionPayments
      })),
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    },
    ...(currentInputs.isEmploymentIncome ? [{
      label: 'Employment Insurance',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(createTaxInputsForIncome(income)).employmentInsurance ?? 0
      })),
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    }] : []),
    {
      label: 'Take-Home Pay',
      data: incomePoints.map(income => ({
        x: income,
        y: calculateTaxes(createTaxInputsForIncome(income)).takeHomeIncome
      })),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      yAxisID: 'y',
      type: 'bar' as const,
      stack: 'stack0',
    },
    {
      label: 'Take-Home %',
      data: incomePoints.map(income => {
        const result = calculateTaxes(createTaxInputsForIncome(income));
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

export const getChartOptions = (
  chartRange: ChartRange,
  currentIncome: number,
  useCompactLabelFormat: boolean = false
): ChartOptions<'bar' | 'line'> => {
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
          title: function(context: TooltipItem<'bar' | 'line'>[]) {
            const income = context[0].parsed.x;
            return `Income: ${formatJPY(income)}`;
          },
          label: function(context: TooltipItem<'bar' | 'line'>) {
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
          medianIncome: 4330000,
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
          callback: function(this: Scale<CoreScaleOptions>, tickValue: number | string) {
            const value = Number(tickValue);
            return useCompactLabelFormat
              ? formatYenCompact(value)
              : formatJPY(value);
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
          callback: function(this: Scale<CoreScaleOptions>, tickValue: number | string) {
            const value = Number(tickValue);
            return useCompactLabelFormat
              ? formatYenCompact(value)
              : formatJPY(value);
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, tickValue: number | string) {
            const value = Number(tickValue);
            return value.toFixed(0) + '%';
          }
        }
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
