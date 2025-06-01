import React, { useMemo, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js'; // Added TooltipItem
import { Box, Paper, Slider, Typography, useTheme, useMediaQuery } from '@mui/material';
import type { ChartRange } from '../../types/tax';
import { formatJPY } from '../../utils/formatters';
import { generateChartData, getChartOptions, currentAndMedianIncomeChartPlugin } from '../../utils/chartConfig';
import type { HealthInsuranceProviderId } from '../../types/healthInsurance';

// Register only the Chart.js components we need
ChartJS.register(
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
);

interface TakeHomeChartProps {
  currentIncome: number;
  isEmploymentIncome: boolean;
  isOver40: boolean;
  healthInsuranceProvider: HealthInsuranceProviderId; // Added
  prefecture: string; // Added
  className?: string;
  style?: React.CSSProperties;
}

// Define a type for the mark objects
type ChartMark = {
  value: number;
  label: string;
};

// Define static marks outside the component
const MAJOR_MARKS: ChartMark[] = [
  { value: 0, label: '¥0' },
  { value: 20000000, label: '¥20M' },
  { value: 40000000, label: '¥40M' },
  { value: 60000000, label: '¥60M' },
  { value: 80000000, label: '¥80M' },
  { value: 100000000, label: '¥100M' },
];

const MINOR_MARKS: ChartMark[] = [
  { value: 10000000, label: '' },
  { value: 30000000, label: '' },
  { value: 50000000, label: '' },
  { value: 70000000, label: '' },
  { value: 90000000, label: '' },
];

const STEP_SIZE = 1000000; // 1M steps

// Constants for custom legend
const YOUR_INCOME_COLOR = 'rgba(255, 99, 132, 1)';
const MEDIAN_INCOME_COLOR = 'rgba(255, 206, 86, 1)';
const MEDIAN_INCOME_VALUE = 4330000; // Matches value in chartConfig.ts

const TakeHomeChart: React.FC<TakeHomeChartProps> = ({ 
  currentIncome, 
  isEmploymentIncome,
  isOver40,
  healthInsuranceProvider,
  prefecture,
  className = '',
  style
}) => {
  const [chartRange, setChartRange] = useState<ChartRange>({
    min: 0,
    max: 10000000, // 10 million yen
  });
  
  const handleRangeChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setChartRange({ min: newValue[0], max: newValue[1] });
    }
  };
  
  const theme = useTheme();
  const chartRef = useRef<ChartJS<'bar' | 'line'>>(null);

  // Generate chart data using the utility function
  const chartData = useMemo<ChartData<'bar' | 'line'>>(
    () => generateChartData(chartRange, { 
      isEmploymentIncome, 
      isOver40, 
      healthInsuranceProvider, 
      prefecture 
    }),
    [chartRange, isEmploymentIncome, isOver40, healthInsuranceProvider, prefecture]
  );

  // Get chart options using the utility function
  const chartOptions = useMemo<ChartOptions<'bar' | 'line'>>(
    () => getChartOptions(chartRange, currentIncome),
    [chartRange, currentIncome]
  );

  // Use media query to determine if we should show minor marks
  const showMinorMarks = useMediaQuery(theme.breakpoints.up('md'));

  // Combine marks based on screen size
  const visibleMarks = useMemo(() => {
    const marks = [...MAJOR_MARKS];
    if (showMinorMarks) {
      marks.push(...MINOR_MARKS);
    }
    // Sort marks by value to ensure consistent rendering
    return marks.sort((a, b) => a.value - b.value);
  }, [showMinorMarks]);

  // Determine if legend items should be visible
  const yourIncomeIsVisibleInChart = currentIncome > 0 && currentIncome >= chartRange.min && currentIncome <= chartRange.max;
  const medianIncomeIsVisibleInChart = MEDIAN_INCOME_VALUE >= chartRange.min && MEDIAN_INCOME_VALUE <= chartRange.max;

  return (
    <Paper 
      elevation={0}
      className={className}
      sx={{
        p: 3,
        mt: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        ...style
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Take-Home Pay Chart
        </Typography>
      </Box>
      
      <Box className="chart-container">
        <Chart 
          ref={chartRef}
          type="bar" 
          data={chartData} 
          options={chartOptions}
          style={{ height: '100%', width: '100%' }}
        />
      </Box>

      {/* Custom Legend for Income Lines */}
      <Box className="chart-legend">
        {currentIncome > 0 && (
          <div 
            className="legend-item" 
            style={{ opacity: yourIncomeIsVisibleInChart ? 1 : 0.5 }}
          >
            <span 
              className="legend-marker" 
              style={{ backgroundColor: YOUR_INCOME_COLOR }}
            />
            <Typography variant="body2" color="text.secondary">
              Your Income: {formatJPY(currentIncome)}
            </Typography>
          </div>
        )}
        <div 
          className="legend-item"
          style={{ opacity: medianIncomeIsVisibleInChart ? 1 : 0.5 }}
        >
          <span 
            className="legend-marker" 
            style={{ backgroundColor: MEDIAN_INCOME_COLOR }}
          />
          <Typography variant="body2" color="text.secondary">
            Median Income: {formatJPY(MEDIAN_INCOME_VALUE)}
          </Typography>
        </div>
      </Box>

      
      <Paper 
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          bgcolor: 'action.hover',
          borderRadius: 1,
          position: 'relative',
          overflow: 'visible',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '100%', overflow: 'visible' }}>
          <Typography id="range-slider" variant="subtitle2" gutterBottom>
            Chart Income Range: {formatJPY(chartRange.min)} - {formatJPY(chartRange.max)}
          </Typography>
        </Box>
          <Slider
            value={[chartRange.min, chartRange.max]}
            onChange={handleRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={100000000}
            step={STEP_SIZE}
            marks={visibleMarks}
            valueLabelFormat={(value) => `¥${value.toLocaleString()}`}
            aria-labelledby="range-slider"
            className="range-slider"
          />
        </Paper>
      </Paper>
  );
};

export default TakeHomeChart;