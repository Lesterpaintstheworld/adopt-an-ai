import { Box, Container, Typography } from '@mui/material';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  console.log('MainLayout rendering...');
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
      
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2023 raise-an.ai - All rights reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
