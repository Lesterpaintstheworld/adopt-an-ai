import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

export const MainLayout = () => {
  console.log('MainLayout rendering...');
  const navigate = useNavigate();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ typography: 'h6' }}
          >
            raise-an.ai
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit"
              onClick={() => navigate('/tech-tree')}
            >
              Tech Tree
            </Button>
            <Button 
              color="inherit"
              onClick={() => navigate('/pricing')}
            >
              Pricing
            </Button>
            <Button 
              color="inherit"
              onClick={() => navigate('/enterprise')}
            >
              Enterprise
            </Button>
            <Button 
              variant="outlined" 
              color="inherit"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
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
