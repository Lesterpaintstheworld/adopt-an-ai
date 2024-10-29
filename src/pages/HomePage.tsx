import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          raise-an.ai
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Foster and develop your own AI companion
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Create Your AI
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/create')}
              size="large"
            >
              Get Started
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Adopt an AI
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/adopt')}
              size="large"
            >
              Browse AIs
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
