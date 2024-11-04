import { Box, Typography } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';

export default function TeamPage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="team" />
      <Typography variant="h1">AI Team</Typography>
    </Box>
  );
}
