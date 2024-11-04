import React from 'react';
import { Box, Typography } from '@mui/material';
import { TutorialDialog } from '../components/tutorial/TutorialDialog';

export default function GPUsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1">GPUs</Typography>
      <TutorialDialog />
    </Box>
  );
}
