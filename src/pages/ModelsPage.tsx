import { Box, Typography } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';

export default function ModelsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="models" />
      <Typography variant="h1">Models</Typography>
    </Box>
  );
}
