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
import type { ChartData, ChartOptions } from 'chart.js';
import { Box, Slider, Typography, useTheme, useMediaQuery } from '@mui/material';
import type { ChartRange } from '../../types/tax';
import { formatJPY } from '../../utils/formatters';
import { generateChartData, getChartOptions, currentAndMedianIncomeChartPlugin } from '../../utils/chartConfig';

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
    () => generateChartData(chartRange, isEmploymentIncome, isOver40),
    [chartRange, isEmploymentIncome, isOver40]
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
    <Box 
      className={className}
      sx={{
        width: '100%',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        mt: 4,
        ...style
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Income Breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Adjust the range to see how different income levels affect your take-home pay
        </Typography>
      </Box>
      
      <Box sx={{ height: '400px', mb: 4 }}>
        <Chart 
          ref={chartRef}
          type="bar" 
          data={chartData} 
          options={chartOptions}
          style={{ height: '100%', width: '100%' }}
        />
      </Box>

      {/* Custom Legend for Income Lines */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1, mb: 3, flexWrap: 'wrap' }}>
        {currentIncome > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              opacity: yourIncomeIsVisibleInChart ? 1 : 0.5,
              transition: 'opacity 0.3s ease-in-out' // Optional: smooth transition for opacity change
            }}
          >
            <Box sx={{ width: 3, height: 16, bgcolor: YOUR_INCOME_COLOR, mr: 1, borderRadius: '2px' }} />
            <Typography variant="body2" color="text.secondary">
              Your Income: {formatJPY(currentIncome)}
            </Typography>
          </Box>
        )}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            opacity: medianIncomeIsVisibleInChart ? 1 : 0.5,
            transition: 'opacity 0.3s ease-in-out' // Optional: smooth transition for opacity change
          }}
        >
          <Box sx={{ width: 3, height: 16, bgcolor: MEDIAN_INCOME_COLOR, mr: 1, borderRadius: '2px' }} />
          <Typography variant="body2" color="text.secondary">
            Median Income: {formatJPY(MEDIAN_INCOME_VALUE)}
          </Typography>
        </Box>
      </Box>

      
      <Box sx={{ 
        mt: 4,
        p: 3, 
        bgcolor: 'background.default', 
        borderRadius: 1,
        position: 'relative',
        overflow: 'visible',
        width: '100%',
        maxWidth: '100%',
        '& > .MuiBox-root': {
          width: '100%',
          maxWidth: '100%',
          overflow: 'visible',
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
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
            sx={{
              width: 'calc(100% - 20px)',
              mx: 'auto',
              display: 'block',
              '& .MuiSlider-rail, & .MuiSlider-track': {
                height: 4,
              },
              '& .MuiSlider-mark': {
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                '&.MuiSlider-markActive': {
                  opacity: 1,
                  backgroundColor: 'currentColor',
                },
                // Hide minor marks on small screens
                [theme.breakpoints.down('md')]: {
                  '&[data-index^="m"]': {
                    display: 'none',
                  },
                },
              },
              '& .MuiSlider-markLabel': {
                fontSize: '0.75rem',
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                mt: 1,
                '&[data-index="0"], &[data-index="5"]': {
                  // First and last labels (0 and 100M)
                  transform: 'translateX(0%)',
                  '&[data-index="0"]': {
                    left: '4px !important',
                  },
                  '&[data-index="5"]': {
                    left: 'auto !important',
                    right: '0 !important',
                    transform: 'translateX(0%)',
                  },
                },
                '&:not([data-index="0"]):not([data-index="5"]):not([data-index^="m"])': {
                  // Middle labels (20M-80M), excluding minor marks (which have index starting with 'm')
                  transform: 'translateX(-50%)',
                },
              },
              '& .MuiSlider-valueLabel': {
                backgroundColor: 'primary.main',
                borderRadius: 1,
                p: 1,
                '&:before': {
                  content: '""',
                  width: 8,
                  height: 8,
                  backgroundColor: 'primary.main',
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                },
              },
            }}
        />
      </Box>
    </Box>
  );
};

export default TakeHomeChart;