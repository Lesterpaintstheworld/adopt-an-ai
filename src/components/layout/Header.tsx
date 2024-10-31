import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          raise-an.ai
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/tech-tree"
          >
            Tech Tree
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/missions"
            sx={{ 
              display: 'inline-flex',
              mx: 1
            }}
          >
            Missions
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/adopt"
          >
            Adopt
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/pricing"
          >
            Pricing
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/blog"
          >
            Blog
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/login"
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
