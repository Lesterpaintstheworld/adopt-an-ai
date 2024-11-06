import { Box, Typography } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import TeamsList from '../components/teams/TeamsList';

export default function TeamsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="team" />
      <Typography variant="h4" gutterBottom>
        Teams
      </Typography>
      <TeamsList />
    </Box>
  );
}
