import { Box, Typography } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';

export default function TeamPage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="teams" />
      <Typography variant="h1">Teams</Typography>
    </Box>
  );
}
