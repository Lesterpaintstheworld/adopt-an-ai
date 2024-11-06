import { Box, Typography, Paper } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import MyGPUsSection from '../components/gpus/MyGPUsSection';
import AvailableGPUsSection from '../components/gpus/AvailableGPUsSection';

export default function GPUsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="GPUs" />
      <Typography 
        variant="h1" 
        gutterBottom
        data-tour="GPUs-title"
      >
        GPUs
      </Typography>

      {/* My GPUs Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          mb: 4,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        }}
      >
        <Typography variant="h2" gutterBottom>My GPUs</Typography>
        <MyGPUsSection />
      </Paper>

      {/* Available GPUs Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        }}
      >
        <Typography variant="h2" gutterBottom>Available GPUs</Typography>
        <AvailableGPUsSection />
      </Paper>
    </Box>
  );
}
