import React from 'react';
import { Box } from '@mui/material';
import TechTreePage from './TechTreePage';

const StandaloneTechTreePage = () => {
  return (
    <Box sx={{ 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      // Remove the top padding that was compensating for the menu
      '& > div': {
        paddingTop: '0 !important'
      },
      // Adjust the fixed positioning of the inner container
      '& > div > div': {
        top: '0 !important'
      }
    }}>
      <TechTreePage />
    </Box>
  );
};

export default StandaloneTechTreePage;
