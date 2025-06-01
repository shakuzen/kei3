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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InfoTooltip } from '../ui/InfoTooltip';

import type { TakeHomeInputs } from '../../types/tax'; // Assuming HealthInsuranceProviderId is used in TakeHomeInputs
import {
  HealthInsuranceProvider,
  DEFAULT_PROVIDER_REGION, // Import DEFAULT_PROVIDER_REGION
} from '../../types/healthInsurance';
import { NATIONAL_HEALTH_INSURANCE_REGIONS } from '../../data/nationalHealthInsurance';
import { ALL_EMPLOYEES_HEALTH_INSURANCE_DATA } from '../../data/employeesHealthInsurance'; // Import data source
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
      flexWrap: 'wrap',
      gap: { xs: 2, sm: 3 },
      alignItems: { xs: 'stretch', sm: 'flex-start' },
      mb: 3,
      width: '100%',
      '& > *': {
        flex: '1 1 auto',
        minWidth: 0, // Prevent overflow
      }
    },
    incomeTypeToggle: {
      maxWidth: { sm: '280px' },
    },
    incomeInput: {
      width: '100%',
      '& .MuiInputBase-root': {
        fontSize: { xs: '1rem', sm: '1.1rem' },
      },
      '& .MuiInputAdornment-positionStart': {
        mt: '0 !important'
      },
      '& .MuiInputBase-input': {
        fontSize: { xs: '0.95rem', sm: '1rem' },
      }
    },
    // Common style for the Box containing a Switch and its labels
    sharedSwitchControlBox: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      bgcolor: 'action.hover',
      borderRadius: 2,
      p: 1,
      width: 'fit-content'
    },
    ageToggleOuter: {
      mt: 4,
      mb: 1,
      width: { xs: '100%', sm: 'auto' }
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

  // Determine available health insurance providers based on income type
  const availableProviders = React.useMemo(() => {
    if (inputs.isEmploymentIncome) {
      // Filter out National Health Insurance for employment income
      return Object.values(HealthInsuranceProvider).filter(
        provider => provider.id !== HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.id
      );
    } else {
      // Only National Health Insurance for non-employment income
      return [HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE];
    }
  }, [inputs.isEmploymentIncome]);

  const isHealthInsuranceProviderDropdownDisabled = availableProviders.length <= 1;

  // Derive regions for the currently selected health insurance provider
  const derivedProviderRegions = React.useMemo(() => {
    const providerId = inputs.healthInsuranceProvider;
    if (!providerId) return [];

    let regionKeys: string[] = [];

    if (providerId === HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.id) {
      regionKeys = NATIONAL_HEALTH_INSURANCE_REGIONS;
    } else {
      // Employee health insurance provider
      const providerData = ALL_EMPLOYEES_HEALTH_INSURANCE_DATA[providerId];
      if (providerData) {
        regionKeys = Object.keys(providerData);
      }
    }
    
    return regionKeys;
  }, [inputs.healthInsuranceProvider]);

  // True if the only derived region is the DEFAULT_PROVIDER_REGION
  const isEffectivelySingleDefaultRegion = 
    derivedProviderRegions.length === 1 && derivedProviderRegions[0] === DEFAULT_PROVIDER_REGION;

  // Prefecture dropdown is disabled if:
  // 1. No health insurance providers are available at all.
  // 2. The selected provider has no regions listed in its data.
  // 3. The selected provider has only one region (this includes the case where it's DEFAULT_PROVIDER_REGION).
  const isPrefectureDropdownEffectivelyDisabled = 
    availableProviders.length === 0 ||
    derivedProviderRegions.length === 0 || // Covers case where provider has no regions in data
    derivedProviderRegions.length === 1;   // Covers case where provider has only one region (e.g., only Tokyo, or only DEFAULT)

  // Determine the value to pass to the Select component's value prop for UI display.
  const prefectureSelectValueForUI = React.useMemo(() => {
    // If the situation is a single default region (like Kanto ITS Kenpo)
    // AND the actual input value for prefecture IS that default region,
    // then the UI Select component should receive an empty string to appear blank and satisfy MUI.
    if (isEffectivelySingleDefaultRegion && inputs.prefecture === DEFAULT_PROVIDER_REGION) {
      return '';
    }
    // Otherwise, use the actual prefecture value from the inputs state.
    return inputs.prefecture;
  }, [inputs.prefecture, isEffectivelySingleDefaultRegion]);

  // Menu items to display in the prefecture dropdown.
  const prefectureMenuItemsToDisplay = React.useMemo(() => {
    if (isEffectivelySingleDefaultRegion) {
      return []; // Don't show "DEFAULT" as a selectable option if it's the only one
    }
    return derivedProviderRegions; // This is an array of strings (region IDs)
  }, [derivedProviderRegions, isEffectivelySingleDefaultRegion]);

  const handleSelectChange = (e: { target: { name: string; value: unknown } }) => {
    // The parent component's onInputChange handler is responsible for
    // managing cascading state updates (e.g., setting a default prefecture).
    const event = {
      target: {
        ...e.target,
        type: 'select'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  return (
    <Box className="form-container">
      <Typography variant="h5" component="h2" gutterBottom>
        Your Information
      </Typography>
      <Box className="form-group">
        {/* Combined Employment Income Switch and Annual Income TextField Section */}
        <Box sx={styles.formSection}>
          {/* Employment Income Switch Section - Child 1 of formSection */}
          <Box sx={{
            ...styles.incomeTypeToggle, // Provides maxWidth
            flexGrow: { sm: 0 },       // Prevent growing on sm+ screens
            flexShrink: { sm: 0 },     // Prevent shrinking on sm+ screens
          }}>
            <Typography variant="subtitle2" className="form-label" sx={{ display: 'flex', alignItems: 'center' }}>
              Income Type
              <InfoTooltip title="Select if your income is from employment or other sources (e.g., business, miscellaneous)" />
            </Typography>
            <Box sx={styles.sharedSwitchControlBox}>
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
                sx={{ minWidth: 70, textAlign: 'center' }} // Reduced minWidth
              >
                Employment
              </Typography>
            </Box>
          </Box>

          {/* Income Input Section - Child 2 of formSection */}
          <Box sx={{ 
            width: { xs: '100%', sm: 'auto' }, // Full width on xs, auto on sm+ for flex control
            minWidth: { sm: '180px' },         // Reduced minimum width on sm+
            maxWidth: { sm: '200px' }          // Reduced maximum width on sm+
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {inputs.isEmploymentIncome ? 'Gross Employment Income' : 'Net Income (Business etc.)'}
            </Typography>
            <TextField
              id="annualIncome"
              name="annualIncome"
              type="number"
              value={inputs.annualIncome}
              onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              label="Annual Income"
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
              slotProps={{
                input: {
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
                    max: 1000000000, // Cap at 1 billion yen
                    step: 10000,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    style: { textAlign: 'right' },
                    'aria-label': 'Annual income in Japanese Yen',
                    size: 10
                  }
                },

                inputLabel: {
                  shrink: true,
                }
              }} />
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
        <Box sx={styles.ageToggleOuter}>
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            Age
            <InfoTooltip title="Your obligation to pay nursing insurance premiums depends on your age." />
          </Typography>
          {/* Apply the shared style here for consistency */}
          <Box sx={styles.sharedSwitchControlBox}>
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
            {/* Group Health Insurance Provider and Prefecture */}
            <Box sx={styles.formSection}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Health Insurance Provider
                  <InfoTooltip title="Your health insurance provider affects your premium calculations" />
                </Typography>
                <Select
                  id="healthInsuranceProvider"
                  name="healthInsuranceProvider"
                  value={inputs.healthInsuranceProvider}
                  onChange={handleSelectChange}
                  disabled={isHealthInsuranceProviderDropdownDisabled}
                  fullWidth
                >
                  {availableProviders.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.displayName}
                    </MenuItem>
                  ))}
                </Select>
                {isHealthInsuranceProviderDropdownDisabled && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {inputs.isEmploymentIncome
                      ? availableProviders.length > 0 ? `Automatically set to ${availableProviders[0].displayName} for employment income.` : 'No employee health insurance providers available.'
                      : `Automatically set to ${HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.displayName} for non-employment income.`
                    }
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Prefecture
                  <InfoTooltip title="Select your prefecture for local tax calculations" />
                </Typography>
                <Select
                  id="prefecture"
                  name="prefecture"
                  value={prefectureSelectValueForUI}
                  onChange={handleSelectChange}
                  disabled={isPrefectureDropdownEffectivelyDisabled}
                  fullWidth
                >
                  {prefectureMenuItemsToDisplay.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                </Select>
                {/* You might want to add helper text here if the list is empty or provider not set */}
              </FormControl>
            </Box>
            <FormControl fullWidth sx={{ mt: 0 }}> {/* Ensure this FormControl for dependents has the correct top margin */}
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
                slotProps={{
                  htmlInput: {
                    min: 0,
                    'aria-label': 'Number of dependents'
                  },

                  inputLabel: { shrink: true }
                }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Dependent calculations will be implemented in a future update
              </Typography>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
} 