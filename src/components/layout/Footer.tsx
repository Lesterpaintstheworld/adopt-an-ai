import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/tech-tree"
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Tech Tree
            </Link>
            <Link
              component={RouterLink}
              to="/my-ais"
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              My AIs
            </Link>
            <Link
              component={RouterLink}
              to="/missions"
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Missions
            </Link>
            <Link
              component={RouterLink}
              to="/blog"
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Blog
            </Link>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} raise-an.ai - All rights reserved
        </Typography>
      </Container>
    </Box>
  );
};
