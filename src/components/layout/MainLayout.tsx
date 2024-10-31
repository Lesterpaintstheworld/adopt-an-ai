import { Box, Container, Typography, Button } from '@mui/material';
import { Header } from './Header';
import { Link as RouterLink } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  console.log('MainLayout rendering...');
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Container>
          <Box sx={{ display: 'flex', gap: 2, py: 1 }}>
            <Button component={RouterLink} to="/" color="inherit">Home</Button>
            <Button component={RouterLink} to="/about" color="inherit">About</Button>
            <Button component={RouterLink} to="/blog" color="inherit">Blog</Button>
            <Button component={RouterLink} to="/adopt" color="inherit">Adopt</Button>
            <Button component={RouterLink} to="/missions" color="inherit">Missions</Button>
            <Button component={RouterLink} to="/tech-tree" color="inherit">Tech Tree</Button>
            <Button component={RouterLink} to="/pricing" color="inherit">Pricing</Button>
          </Box>
        </Container>
      </Box>
      
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
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
