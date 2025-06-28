import React, { useMemo, useRef, useState, useEffect } from 'react';
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
import { MEDIAN_INCOME_VALUE } from '../../data/income';

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
  
  // Track whether the user has manually adjusted the range
  const [hasManuallyAdjustedRange, setHasManuallyAdjustedRange] = useState(false);
  
  // Function to calculate auto-centered range based on income
  const calculateAutoCenteredRange = (income: number): ChartRange => {
    // Round down to the nearest million
    const roundedDownIncome = Math.floor(income / 1000000) * 1000000;
    
    // Set range to be from that number plus or minus 5 million yen
    let min = roundedDownIncome - 5000000;
    let max = roundedDownIncome + 5000000;
    
    // Ensure range is never less than 0 or more than 100 million
    min = Math.max(0, min);
    max = Math.min(100000000, max);
    
    // If max would be less than min after the constraint, adjust accordingly
    if (max - min < 10000000) {
      if (min === 0) {
        max = 10000000;
      } else if (max === 100000000) {
        min = 90000000;
      }
    }
    
    return { min, max };
  };
  
  // Auto-adjust range when income changes, but only if user hasn't manually adjusted it
  useEffect(() => {
    if (!hasManuallyAdjustedRange && currentIncome > 0) {
      const newRange = calculateAutoCenteredRange(currentIncome);
      setChartRange(newRange);
    }
  }, [currentIncome, hasManuallyAdjustedRange]);
  
  const handleManualRangeChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setChartRange({ min: newValue[0], max: newValue[1] });
      // Mark that the user has manually adjusted the range
      setHasManuallyAdjustedRange(true);
    }
  };
  
  const theme = useTheme();
  const useCompactLabelFormat = useMediaQuery(theme.breakpoints.down('md'));

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
    () => getChartOptions(chartRange, currentIncome, useCompactLabelFormat),
    [chartRange, currentIncome, useCompactLabelFormat]
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
        p: { xs: 1.2, sm: 3 },
        mt: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 2,
        ...style
      }}
    >
      <Box sx={{ mb: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: { xs: '1.08rem', sm: '1.3rem' },
            fontWeight: 700,
            mb: 0,
          }}
        >
          Take-Home Pay Chart
        </Typography>
      </Box>
      
      <Box className="chart-container" sx={{ mb: { xs: 1.2, sm: 2 } }}>
        <Chart 
          ref={chartRef}
          type="bar" 
          data={chartData} 
          options={chartOptions}
          style={{ height: '100%', width: '100%' }}
        />
      </Box>

      {/* Custom Legend for Income Lines */}
      <Box
        className="chart-legend"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 0.7, sm: 2 },
          mb: { xs: 1.2, sm: 2 },
          mt: 0,
        }}
      >
        {currentIncome > 0 && (
          <Box 
            className="legend-item" 
            sx={{
              display: 'flex',
              alignItems: 'center',
              opacity: yourIncomeIsVisibleInChart ? 1 : 0.5,
              gap: 1,
            }}
          >
            <Box
              className="legend-marker"
              sx={{
                width: 2,           // vertical line: narrow width
                height: 24,         // vertical line: tall height
                borderRadius: 1,
                backgroundColor: YOUR_INCOME_COLOR,
                display: 'inline-block',
                mr: 1,
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.97rem', sm: '1rem' },
                fontWeight: 500,
              }}
            >
              Your Income: {formatJPY(currentIncome)}
            </Typography>
          </Box>
        )}
        <Box
          className="legend-item"
          sx={{
            display: 'flex',
            alignItems: 'center',
            opacity: medianIncomeIsVisibleInChart ? 1 : 0.5,
            gap: 1,
          }}
        >
          <Box
            className="legend-marker"
            sx={{
              width: 2,           // vertical line: narrow width
              height: 24,         // vertical line: tall height
              borderRadius: 1,
              backgroundColor: MEDIAN_INCOME_COLOR,
              display: 'inline-block',
              mr: 1,
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.97rem', sm: '1rem' },
              fontWeight: 500,
            }}
          >
            Median Income: {formatJPY(MEDIAN_INCOME_VALUE)}
          </Typography>
        </Box>
      </Box>

      <Paper 
        elevation={0}
        sx={{
          mt: { xs: 1.2, sm: 2 },
          p: { xs: 1.2, sm: 2 },
          bgcolor: 'action.hover',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden', // keep for rounded corners
          width: '100%',
          boxShadow: 'none',
        }}
      >
        <Box sx={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%', 
          pb: 3,
        }}>
          <Typography
            id="range-slider"
            variant="subtitle2"
            gutterBottom
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              mb: { xs: 0.5, sm: 1 },
            }}
          >
            Chart Income Range: {formatJPY(chartRange.min)} - {formatJPY(chartRange.max)}
          </Typography>
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 48px)' }, // leave space for labels
              mx: 'auto',
            }}
          >
            <Slider
              value={[chartRange.min, chartRange.max]}
              onChange={handleManualRangeChange}
              valueLabelDisplay="off"
              min={0}
              max={100000000}
              step={STEP_SIZE}
              marks={visibleMarks}
              valueLabelFormat={(value) => `¥${formatJPY(value)}`}
              aria-labelledby="range-slider"
              className="range-slider"
              sx={{
                mt: 0,
                mb: 0,
                '& .MuiSlider-thumb': {
                  width: 18,
                  height: 18,
                },
                '& .MuiSlider-markLabel': {
                  fontSize: { xs: '0.92rem', sm: '1rem' },
                  whiteSpace: 'nowrap',
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Paper>
  );
};

export default TakeHomeChart;