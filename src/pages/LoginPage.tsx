import { Box, Container, Typography, Paper } from '@mui/material';
import { GoogleLogin } from '../components/auth/GoogleLogin';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/my-ais" replace />;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'background.paper',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Sign in to raise-an.ai
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Connect with your Google account to manage your AIs
          </Typography>
          <GoogleLogin />
        </Paper>
      </Box>
    </Container>
  );
}
