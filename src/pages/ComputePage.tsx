import { Box, Typography, Paper, Divider } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import MyComputeSection from '../components/compute/MyComputeSection';
import AvailableComputeSection from '../components/compute/AvailableComputeSection';

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

      {/* My Compute Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          mb: 4,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        }}
      >
        <Typography variant="h2" gutterBottom>My Compute</Typography>
        <MyComputeSection />
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
        <AvailableComputeSection />
      </Paper>
    </Box>
  );
}
