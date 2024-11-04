import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Header = () => {
  return (
    <AppBar 
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: (theme) => theme.palette.text.primary
          }}
        >
          raise-an.ai
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            component={RouterLink} 
            to="/tech-tree"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            Tech Tree
          </Button>
          <Button 
            component={RouterLink} 
            to="/adopt"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            Adopt
          </Button>
          <Button 
            component={RouterLink} 
            to="/my-ais"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            My AIs
          </Button>
          <Button 
            component={RouterLink} 
            to="/pricing"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            Pricing
          </Button>
          <Button 
            component={RouterLink} 
            to="/blog"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            Blog
          </Button>
          <Button 
            component={RouterLink} 
            to="/login"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
