import { Box, Typography } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';

export default function TrainingPage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="training" />
      <Typography variant="h1">Training</Typography>
    </Box>
  );
}
