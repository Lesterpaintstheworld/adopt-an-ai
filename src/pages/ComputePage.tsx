import { Box, Typography, Paper } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';

export default function ComputePage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="compute" />
      <Typography 
        variant="h1" 
        gutterBottom
        data-tour="compute-title"
      >
        Compute
      </Typography>
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        }}
        data-tour="compute-description"
      >
        <Typography variant="h2" gutterBottom>Computing Resources</Typography>
        <Typography variant="body1" paragraph>
          Manage and monitor your AI computing resources and infrastructure.
        </Typography>
      </Paper>
    </Box>
  );
}
