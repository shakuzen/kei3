import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material';
import type { TakeHomeResults } from '../../types/tax';
import SummaryTab from './tabs/SummaryTab';
import SocialInsuranceTab from './tabs/SocialInsuranceTab';
import TaxesTab from './tabs/TaxesTab';
import FurusatoNozeiTab from './tabs/FurusatoNozeiTab';

interface DetailedTaxResultsProps {
  results: TakeHomeResults;
}

const TakeHomeResultsDisplay: React.FC<DetailedTaxResultsProps> = ({ results }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const tabLabels = ['Summary', 'Social Insurance', 'Taxes', 'Furusato Nozei'];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.2, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        width: '100%',
        mx: 'auto',
      }}
    >
      <Typography variant="h6" component="h2" sx={{ fontSize: { xs: '1.08rem', sm: '1.3rem' }, mb: { xs: 1, sm: 2 }, fontWeight: 700 }}>
        Take-Home Pay Breakdown
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            minHeight: isMobile ? 36 : 48,
            '& .MuiTab-root': {
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              minHeight: isMobile ? 36 : 48,
              padding: isMobile ? '6px 8px' : '12px 16px',
            }
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab 
              key={label} 
              label={label} 
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {currentTab === 0 && (
          <Box role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0">
            <SummaryTab results={results} />
          </Box>
        )}
        {currentTab === 1 && (
          <Box role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1">
            <SocialInsuranceTab results={results} />
          </Box>
        )}
        {currentTab === 2 && (
          <Box role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2">
            <TaxesTab results={results} />
          </Box>
        )}
        {currentTab === 3 && (
          <Box role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3">
            <FurusatoNozeiTab results={results} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TakeHomeResultsDisplay;
