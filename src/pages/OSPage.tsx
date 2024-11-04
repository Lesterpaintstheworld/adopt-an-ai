import { Box, Typography, Paper } from '@mui/material';

export default function OSPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography 
        variant="h1" 
        gutterBottom
        data-tour="os-title"
      >
        KinOS
      </Typography>
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        }}
        data-tour="os-description"
      >
        <Typography variant="h2" gutterBottom>Operating System</Typography>
        <Typography variant="body1" paragraph>
          KinOS is our specialized operating system designed for AI autonomy and development.
          It provides a secure and controlled environment for AI systems to learn and operate.
        </Typography>
      </Paper>
    </Box>
  );
}
