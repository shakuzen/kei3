import React from 'react';
import { 
  TextField, 
  FormControl, 
  Select, 
  MenuItem, 
  Typography, 
  Box, 
  Slider, 
  InputAdornment, 
  Switch, 
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import type { TakeHomeInputs } from '../../types/tax';

interface TaxInputFormProps {
  inputs: TakeHomeInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => void;
}

export const TakeHomeInputForm: React.FC<TaxInputFormProps> = ({ inputs, onInputChange }) => {
  const theme = useTheme();
  
  // Component-specific styles that can't be in the global CSS
  const styles = {
    slider: {
      color: 'primary.main',
      '& .MuiSlider-thumb': {
        '&:hover, &.Mui-focusVisible': {
          boxShadow: `0 0 0 8px ${theme.palette.mode === 'dark' 
            ? 'rgba(66, 165, 245, 0.16)' 
            : 'rgba(25, 118, 210, 0.16)'}`,
        },
        '&.Mui-active': {
          boxShadow: `0 0 0 14px ${theme.palette.mode === 'dark' 
            ? 'rgba(66, 165, 245, 0.16)' 
            : 'rgba(25, 118, 210, 0.16)'}`,
        },
      },
    },
    formSection: {
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 3 },
      alignItems: { sm: 'flex-start' },
      mb: 3
    },
    incomeTypeToggle: {
      width: { xs: '100%', sm: 'auto' }
    },
    incomeInput: {
      width: '100%',
      '& .MuiInputBase-root': {
        fontSize: '1.1rem',
      },
      '& .MuiInputAdornment-positionStart': {
        mt: '0 !important'
      }
    },
    ageToggle: {
      mt: 4, 
      mb: 1, 
      width: { xs: '100%', sm: 'auto' }
    },
    ageToggleContainer: {
      display: 'flex', 
      alignItems: 'center',
      gap: 1.5,
      bgcolor: 'action.hover',
      borderRadius: 2,
      p: 1,
      width: 'fit-content'
    },
    ageToggleOption: {
      minWidth: 60, 
      textAlign: 'center',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: 1,
      transition: 'all 0.2s',
      '&:hover': {
        bgcolor: 'action.selected',
      }
    },
    accordion: {
      mt: 3,
      bgcolor: 'background.paper',
      boxShadow: 'none',
      '&:before': {
        display: 'none',
      },
      '&.Mui-expanded': {
        margin: 0,
        marginTop: 3,
      },
    },
    accordionSummary: {
      bgcolor: 'action.hover',
      borderRadius: 1,
      minHeight: '48px !important',
      '&.Mui-expanded': {
        minHeight: '48px !important',
      },
      '& .MuiAccordionSummary-content': {
        margin: '12px 0',
        '&.Mui-expanded': {
          margin: '12px 0',
        },
      },
    },
    accordionDetails: {
      p: 2,
      pt: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    },
  };
  const handleSliderChange = (_: Event, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    const event = {
      target: {
        name: 'annualIncome',
        value: newValue,
        type: 'range'
      },
      currentTarget: {
        name: 'annualIncome',
        value: newValue,
        type: 'range'
      },
      preventDefault: () => {},
      stopPropagation: () => {},
      nativeEvent: new Event('change'),
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      timeStamp: Date.now(),
      type: 'change',
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      persist: () => {}
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  const handleSelectChange = (e: { target: { name: string; value: unknown } }) => {
    onInputChange({
      ...e,
      target: {
        ...e.target,
        type: 'select'
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Box className="form-container">
      <Typography variant="h5" component="h2" gutterBottom>
        Your Information
      </Typography>

      <Box className="form-group">
        {/* Combined Employment Income Switch and Annual Income TextField Section */}
        <Box sx={styles.formSection}>
          {/* Employment Income Switch Section */}
          <Box sx={styles.incomeTypeToggle}>
            <Typography variant="subtitle2" className="form-label">
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                Income Type
                <Tooltip 
                  title="Select if your income is from employment or other sources (e.g., business, miscellaneous)"
                  arrow
                  placement="top"
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 1,
                        '& .MuiTooltip-arrow': {
                          color: 'background.paper',
                          '&:before': {
                            border: '1px solid',
                            borderColor: 'divider',
                          },
                        },
                      }
                    }
                  }}
                >
                  <HelpOutlineIcon 
                    color="action" 
                    fontSize="small" 
                    sx={{ ml: 0.5, opacity: 0.6, '&:hover': { opacity: 0.9 } }} 
                  />
                </Tooltip>
              </Box>
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'action.hover',
              borderRadius: 2,
              p: 1,
              width: 'fit-content'
            }}>
              <Typography 
                variant="body2" 
                color={!inputs.isEmploymentIncome ? 'primary' : 'text.secondary'}
                fontWeight={!inputs.isEmploymentIncome ? 600 : 400}
                sx={{ minWidth: 60, textAlign: 'center' }}
              >
                Other
              </Typography>
              <Switch
                id="isEmploymentIncome"
                name="isEmploymentIncome"
                checked={inputs.isEmploymentIncome}
                onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                color="primary"
              />
              <Typography 
                variant="body2" 
                color={inputs.isEmploymentIncome ? 'primary' : 'text.secondary'}
                fontWeight={inputs.isEmploymentIncome ? 600 : 400}
                sx={{ minWidth: 80, textAlign: 'center' }}
              >
                Employment
              </Typography>
            </Box>
          </Box>

          {/* Income Input Section */}
          <Box sx={{ width: { xs: '100%', sm: '280px' } }}> {/* Define width for income section on larger screens */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {inputs.isEmploymentIncome ? 'Gross Annual Employment Income' : 'Net Annual Income (Business income, etc.)'}
            </Typography>
            <TextField
              id="annualIncome"
              name="annualIncome"
              type="number"
              value={inputs.annualIncome}
              onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              label="Annual Income"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography color="text.secondary">¥</Typography>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="text.secondary">
                      JPY
                    </Typography>
                  </InputAdornment>
                ),
                inputProps: {
                  min: 0,
                  step: 10000,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  style: { textAlign: 'right' },
                  'aria-label': 'Annual income in Japanese Yen',
                  size: 10
                }
              }}
              helperText={inputs.annualIncome > 0 ? `¥${inputs.annualIncome.toLocaleString()}` : 'Enter your annual income'}
              sx={{
                width: '100%', // TextField takes full width of its parent Box
                '& .MuiInputBase-root': {
                  fontSize: '1.1rem',
                },
                '& .MuiInputAdornment-positionStart': {
                  mt: '0 !important'
                }
              }}
            />
          </Box>
        </Box>

        {/* Annual Income Slider */}
        <Box sx={{ px: 1 }}>
          <Slider
            className="income-slider"
            value={inputs.annualIncome}
            onChange={handleSliderChange}
            min={0}
            max={20000000}
            step={10000}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `¥${value.toLocaleString()}`}
            marks={[
              { value: 0, label: '¥0' },
              { value: 5000000, label: '¥5M' },
              { value: 10000000, label: '¥10M' },
              { value: 15000000, label: '¥15M' },
              { value: 20000000, label: '¥20M' },
            ]}
          />
        </Box>

        {/* Age Section */}
        <Box sx={{ mt: 4, mb: 1, width: { xs: '100%', sm: 'auto' } }}> {/* Added mt: 4 for spacing */}
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            Age
            <Tooltip 
              title="Your obligation to pay nursing insurance premiums depends on your age."
              arrow
              placement="top"
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 1,
                    '& .MuiTooltip-arrow': {
                      color: 'background.paper',
                      '&:before': {
                        border: '1px solid',
                        borderColor: 'divider',
                      },
                    },
                  },
                },
              }}
            >
              <HelpOutlineIcon 
                color="action" 
                fontSize="small" 
                sx={{ ml: 0.5, opacity: 0.6, '&:hover': { opacity: 0.9 } }} 
              />
            </Tooltip>
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'action.hover',
            borderRadius: 2,
            p: 1,
            width: 'fit-content' // Ensures the box only takes necessary width
          }}>
            <Typography 
              variant="body2" 
              color={!inputs.isOver40 ? 'primary' : 'text.secondary'}
              fontWeight={!inputs.isOver40 ? 600 : 400}
              sx={{ minWidth: 60, textAlign: 'center' }}
            >
              &lt;40
            </Typography>
            <Switch
              checked={inputs.isOver40}
              onChange={(e) => onInputChange({
                target: {
                  name: 'isOver40',
                  checked: e.target.checked,
                  type: 'checkbox'
                }
              } as React.ChangeEvent<HTMLInputElement>)}
              color="primary"
            />
            <Typography 
              variant="body2" 
              color={inputs.isOver40 ? 'primary' : 'text.secondary'}
              fontWeight={inputs.isOver40 ? 600 : 400}
              sx={{ minWidth: 60, textAlign: 'center' }}
            >
              40+
            </Typography>
          </Box>
        </Box>

        <Accordion 
          elevation={0}
          sx={{
            mt: 4, // Margin to separate from Age Group or Slider above
            '&:before': {
              display: 'none',
            },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="advanced-options-content"
            id="advanced-options-header"
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Typography variant="subtitle2">Advanced Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                Prefecture
                <Tooltip 
                  title="Select your prefecture for local tax calculations"
                  arrow
                  placement="top"
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 1,
                      }
                    }
                  }}
                >
                  <HelpOutlineIcon fontSize="small" sx={{ color: 'text.secondary', ml: 0.5 }} />
                </Tooltip>
              </Typography>
              <Select
                id="prefecture"
                name="prefecture"
                value={inputs.prefecture}
                onChange={handleSelectChange}
                disabled={true}
                fullWidth
              >
                <MenuItem value="Tokyo">Tokyo</MenuItem>
                <MenuItem value="Osaka">Osaka</MenuItem>
                <MenuItem value="Kyoto">Kyoto</MenuItem>
                <MenuItem value="Hokkaido">Hokkaido</MenuItem>
                <MenuItem value="Fukuoka">Fukuoka</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Health Insurance Provider
              </Typography>
              <Select
                id="healthInsuranceProvider"
                name="healthInsuranceProvider"
                value={inputs.healthInsuranceProvider}
                onChange={handleSelectChange}
                disabled={true}
                fullWidth
              >
                <MenuItem value="Kyokai Kenpo">Kyokai Kenpo (Employment Income)</MenuItem>
                <MenuItem value="National Health Insurance">National Health Insurance (Self-employed)</MenuItem>
              </Select>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {inputs.isEmploymentIncome 
                  ? 'Automatically set to Kyokai Kenpo for employment income'
                  : 'Automatically set to National Health Insurance for non-employment income'}
              </Typography>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="numberOfDependents"
                name="numberOfDependents"
                label="Number of Dependents"
                disabled={true}
                value={inputs.numberOfDependents}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = parseInt(e.target.value) || 0;
                  onInputChange({
                    target: {
                      name: 'numberOfDependents',
                      value: value,
                      type: 'number'
                    }
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                type="number"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: 0,
                  'aria-label': 'Number of dependents'
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Dependent calculations will be implemented in a future update
              </Typography>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
} 