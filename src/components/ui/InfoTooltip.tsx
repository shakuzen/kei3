import React, { useState } from 'react';
import { 
  IconButton, 
  Tooltip as MuiTooltip, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface InfoTooltipProps {
  title: string;
  children?: React.ReactNode;
  mobileOnly?: boolean;
  icon?: React.ReactNode; // Custom icon
  iconSx?: object; // Custom icon/button style
  iconAriaLabel?: string; // Custom aria-label
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  title, 
  children,
  mobileOnly = false,
  icon,
  iconSx,
  iconAriaLabel
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const showDialog = isMobile || mobileOnly;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const tooltipContent = (
    <Box sx={{ maxWidth: 420, p: 1, fontSize: isMobile ? '0.85rem' : '1rem' }}>
      {children || title}
    </Box>
  );

  if (showDialog) {
    return (
      <>
        <IconButton 
          onClick={handleOpen}
          size="small"
          sx={{ 
            p: 0.5, 
            ml: 0.5, 
            color: 'text.secondary', 
            ...(iconSx || {}) 
          }}
          aria-label={iconAriaLabel || 'More information'}
        >
          {icon || <HelpOutlineIcon fontSize="small" />}
        </IconButton>
        
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              m: 2,
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              borderRadius: 2,
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>More Information</DialogTitle>
          <DialogContent dividers>
            {children || title}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} variant="contained" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <MuiTooltip 
      title={tooltipContent} 
      arrow
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: 420,
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
      <IconButton 
        size="small"
        sx={{ 
          p: 0.5, 
          ml: 0.5, 
          color: 'text.secondary', 
          verticalAlign: 'middle', 
          ...(iconSx || {}) 
        }}
        aria-label={iconAriaLabel || 'More information'}
      >
        {icon || <HelpOutlineIcon fontSize="small" />}
      </IconButton>
    </MuiTooltip>
  );
};

export default InfoTooltip;
