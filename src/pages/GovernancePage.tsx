import { Box, Typography } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';

export default function GovernancePage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="governance" />
      <Typography variant="h1">Governance</Typography>
    </Box>
  );
}
