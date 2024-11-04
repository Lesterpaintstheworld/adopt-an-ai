import { Box, Typography, Paper } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import TrainingSection from '../components/models/TrainingSection';
import MyModelsSection from '../components/models/MyModelsSection';
import ModelsDatasetSection from '../components/models/ModelsDatasetSection';

export default function ModelsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <TutorialHighlight pageKey="models" />
      <Typography variant="h1" gutterBottom>
        Models
      </Typography>

      {/* Training Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          mb: 4,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        }}
      >
        <Typography variant="h2" gutterBottom>Training</Typography>
        <TrainingSection />
      </Paper>

      {/* My Models Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          mb: 4,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        }}
      >
        <Typography variant="h2" gutterBottom>My Models</Typography>
        <MyModelsSection />
      </Paper>

      {/* Models & Datasets Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        }}
      >
        <Typography variant="h2" gutterBottom>Models & Datasets</Typography>
        <ModelsDatasetSection />
      </Paper>
    </Box>
  );
}
