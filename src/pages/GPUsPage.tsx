import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTutorial } from '../contexts/TutorialContext';
import { TutorialPopup } from '../components/tutorial/TutorialPopup';

export default function GPUsPage() {
  const { isTutorialComplete, startTutorial } = useTutorial();

  useEffect(() => {
    if (!isTutorialComplete) {
      startTutorial();
    }
  }, [isTutorialComplete]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1">GPUs</Typography>
      <TutorialPopup />
    </Box>
  );
}
