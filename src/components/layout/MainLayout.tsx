import { Box, Container, Typography } from '@mui/material';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import SideMenu from '../SideMenu';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        pt: '64px', // Pour compenser le header fixed
        minHeight: 'calc(100vh - 64px)' // Hauteur totale moins header
      }}>
        <SideMenu />
        <Box 
          component="main" 
          sx={{ 
            flex: 1,
            overflow: 'auto',
            p: 3
          }}
        >
          <Outlet />
        </Box>
      </Box>
      
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
