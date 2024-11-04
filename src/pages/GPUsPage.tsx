import { Box, Typography, Container, Divider } from '@mui/material';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import MyComputeSection from '../components/compute/MyComputeSection';
import AvailableComputeSection from '../components/compute/AvailableComputeSection';

export default function GPUsPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <TutorialHighlight pageKey="gpus" />
        
        {/* My Compute Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          My Compute
        </Typography>
        <MyComputeSection />
        
        <Divider sx={{ my: 6 }} />
        
        {/* Available GPUs Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Available GPUs
        </Typography>
        <AvailableComputeSection />
      </Box>
    </Container>
  );
}
