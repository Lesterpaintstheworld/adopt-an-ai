import { Box, Container } from '@mui/material';
import { Header } from './Header';
import Footer from './Footer';
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
        <Container 
          component="main" 
          sx={{ 
            flex: 1,
            overflow: 'auto',
            p: 3
          }}
        >
          <Outlet />
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};
