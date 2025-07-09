import React from 'react';
import { Box, Typography } from '@mui/material';
import type { TakeHomeResults, TakeHomeInputs } from '../../../types/tax';
import { formatJPY } from '../../../utils/formatters';
import { HealthInsuranceProvider } from '../../../types/healthInsurance';
import { ALL_EMPLOYEES_HEALTH_INSURANCE_DATA } from '../../../data/employeesHealthInsurance';
import { getNationalHealthInsuranceParams } from '../../../data/nationalHealthInsurance';

interface PremiumTableTooltipProps {
  results: TakeHomeResults;
  inputs: TakeHomeInputs;
}

const PremiumTableTooltip: React.FC<PremiumTableTooltipProps> = ({ results, inputs }) => {
  const providerId = inputs.healthInsuranceProvider;
  const region = inputs.prefecture;
  const monthlyIncome = results.annualIncome / 12;

  // Auto-scroll to the current row when component mounts or income changes
  // Only applies to employee health insurance tables
  React.useEffect(() => {
    if (providerId === HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.id) {
      return; // Skip for National Health Insurance
    }

    const currentRowElement = document.getElementById('current-income-row');
    const tableContainer = currentRowElement?.closest('[data-table-container]');
    
    if (currentRowElement && tableContainer) {
      // Use setTimeout to ensure the DOM has been updated
      setTimeout(() => {
        const containerRect = tableContainer.getBoundingClientRect();
        const rowRect = currentRowElement.getBoundingClientRect();
        
        // Calculate the scroll position relative to the container
        const containerScrollTop = tableContainer.scrollTop;
        const relativeRowTop = rowRect.top - containerRect.top + containerScrollTop;
        const containerHeight = containerRect.height;
        const rowHeight = rowRect.height;
        
        // Center the row in the container
        const targetScrollTop = relativeRowTop - (containerHeight / 2) + (rowHeight / 2);
        
        // Smooth scroll within the container only
        tableContainer.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [providerId, monthlyIncome]);

  if (providerId === HealthInsuranceProvider.NATIONAL_HEALTH_INSURANCE.id) {
    // National Health Insurance - show region parameters
    const regionData = getNationalHealthInsuranceParams(region);
    if (!regionData) {
      return (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            National Health Insurance Parameters
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Premium calculation parameters for {region} are not available in the current data.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ minWidth: { xs: 0, sm: 360 }, maxWidth: { xs: '100vw', sm: 460 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          National Health Insurance Parameters - {regionData.regionName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: '0.85rem' }}>
          NHI premiums are calculated based on income-based rates and per-capita amounts.
        </Typography>
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.9rem' }}>
            Income-based Rates (Annual)
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            Medical: {(regionData.medicalRate * 100).toFixed(2)}%
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            Support: {(regionData.supportRate * 100).toFixed(2)}%
          </Typography>
          {regionData.ltcRateForEligible && (
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              LTC (40-64): {(regionData.ltcRateForEligible * 100).toFixed(2)}%
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.9rem' }}>
            Per-capita Amounts (Annual)
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            Medical: {formatJPY(regionData.medicalPerCapita)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            Support: {formatJPY(regionData.supportPerCapita)}
          </Typography>
          {regionData.ltcPerCapitaForEligible && (
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              LTC (40-64): {formatJPY(regionData.ltcPerCapitaForEligible)}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.9rem' }}>
            Annual Caps
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            Medical: {formatJPY(regionData.medicalCap)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            Support: {formatJPY(regionData.supportCap)}
          </Typography>
          {regionData.ltcCapForEligible && (
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              LTC: {formatJPY(regionData.ltcCapForEligible)}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
            Standard Deduction: {formatJPY(regionData.nhiStandardDeduction)}
          </Typography>
        </Box>
      </Box>
    );
  } else {
    // Employee Health Insurance - show premium table
    const providerData = ALL_EMPLOYEES_HEALTH_INSURANCE_DATA[providerId];
    if (!providerData || !providerData[region]) {
      return (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Premium Table
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Premium table for {providerId} in {region} is not available in the current data.
          </Typography>
        </Box>
      );
    }

    const premiumTable = providerData[region];
    
    // Find the current row for the user's income
    const currentRow = premiumTable.find(row => 
      monthlyIncome >= row.minIncomeInclusive && monthlyIncome < row.maxIncomeExclusive
    );

    return (
      <Box sx={{ minWidth: { xs: 0, sm: 400 }, maxWidth: { xs: '100vw', sm: 500 } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Health Insurance Premium Table - {providerId} ({region})
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: '0.85rem' }}>
          Monthly premiums by income bracket. Your current income: {formatJPY(monthlyIncome)}/month
          <br />
          <Typography component="span" sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'text.secondary' }}>
            💡 Scroll through the table to view all brackets
          </Typography>
        </Typography>
        
        <Box 
          data-table-container // Identifier for auto-scroll functionality
          sx={{ 
            height: '280px', // Fixed height to show ~10 rows
            overflowY: 'auto',
            overscrollBehavior: 'contain', // Prevent scroll chaining
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            mb: 1,
            // Style the scrollbar
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'action.hover',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'action.selected',
              borderRadius: '4px',
              '&:hover': {
                background: 'action.focus',
              },
            },
          }}
          // Prevent wheel events from bubbling to parent when scrolling inside
          onWheel={(e) => {
            e.stopPropagation();
          }}
          // Also prevent touch scroll events from bubbling
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
        >
          <Box 
            component="table" 
            sx={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.75rem',
              '& th, & td': {
                border: '1px solid',
                borderColor: 'divider',
                padding: '4px 6px',
                textAlign: 'right',
              },
              '& th': {
                backgroundColor: 'background.paper', // Opaque background for headers
                backdropFilter: 'blur(8px)', // Additional blur effect for better readability
                fontWeight: 600,
                fontSize: '0.7rem',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                boxShadow: '0 1px 0 0 rgba(0,0,0,0.12)', // Subtle shadow to separate from content
              },
              '& td:first-of-type': {
                textAlign: 'left',
              }
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box component="th">Monthly Income</Box>
                <Box component="th">Employee (No LTC)</Box>
                <Box component="th">Employee (With LTC)</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {premiumTable.map((row, index) => {
                const isCurrentRow = currentRow === row;
                return (
                  <Box 
                    component="tr" 
                    key={index}
                    id={isCurrentRow ? 'current-income-row' : undefined}
                    sx={{ 
                      backgroundColor: isCurrentRow ? 'primary.main' : 'transparent',
                      color: isCurrentRow ? 'primary.contrastText' : 'text.primary',
                      cursor: 'default',
                      transition: 'all 0.3s ease',
                      transform: isCurrentRow ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isCurrentRow ? 2 : 0,
                      '&:hover': {
                        backgroundColor: isCurrentRow ? 'primary.main' : 'action.hover',
                        transform: 'scale(1.01)',
                      },
                      '& td': {
                        borderColor: isCurrentRow ? 'primary.main' : 'divider',
                      }
                    }}
                  >
                    <Box component="td">
                      {formatJPY(row.minIncomeInclusive)} - {
                        row.maxIncomeExclusive === Infinity ? '∞' : formatJPY(row.maxIncomeExclusive)
                      }
                    </Box>
                    <Box component="td">{formatJPY(row.employeePremiumNoLTC)}</Box>
                    <Box component="td">{formatJPY(row.employeePremiumWithLTC)}</Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontStyle: 'italic', mb: 1 }}>
          Showing all {premiumTable.length} income brackets. Your bracket is highlighted.
        </Typography>
        
        {currentRow && (
          <Box sx={{ mt: 1, p: 1, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
              Your bracket: {formatJPY(currentRow.employeePremiumNoLTC)}/month (no LTC) or {formatJPY(currentRow.employeePremiumWithLTC)}/month (with LTC)
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
};

export default PremiumTableTooltip;
