import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Header = () => {
  return (
    <AppBar 
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) => theme.palette.background.default,
        borderBottom: '1px solid',
        borderColor: 'divider',
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
            to="/missions"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            Missions
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
