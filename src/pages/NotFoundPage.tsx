import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2, #90caf9)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            404
          </Typography>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Oops! This AI hasn't been created yet
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            The page you're looking for seems to have wandered off into the digital void.
            Let's get you back on track!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{ 
                px: 4,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s',
                }
              }}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              sx={{ 
                px: 4,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s',
                }
              }}
            >
              Go Back
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
};
