import React from 'react';
import { Box, Typography } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';

export default function GPUsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight />
      <Typography variant="h1">GPUs</Typography>
    </Box>
  );
}
