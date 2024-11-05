import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, Stack, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MemoryIcon from '@mui/icons-material/Memory';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
            <Chip
              icon={<AttachMoneyIcon />}
              label="$7,250"
              variant="outlined"
              size="small"
              sx={{ 
                borderColor: 'primary.main',
                color: 'text.primary',
                '& .MuiChip-icon': { color: 'primary.main' }
              }}
            />
            <Chip
              icon={<MemoryIcon />}
              label={`${0.89} Mtokens/h`}
              variant="outlined"
              size="small"
              sx={{ 
                borderColor: 'primary.main',
                color: 'text.primary',
                '& .MuiChip-icon': { color: 'primary.main' }
              }}
            />
          </Stack>
          <Button 
            component={RouterLink} 
            to="/tech-tree"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            Tech Tree
          </Button>
          {!isAuthenticated ? (
            <Button 
              component={RouterLink} 
              to="/login"
              sx={{ color: (theme) => theme.palette.text.primary }}
            >
              Login
            </Button>
          ) : (
            <>
              <Button
                onClick={handleMenu}
                sx={{ 
                  color: (theme) => theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Avatar 
                  src={user?.picture} 
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <span>{user?.name}</span>
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem component={RouterLink} to="/settings" onClick={handleClose}>
                  Settings
                </MenuItem>
                <MenuItem onClick={() => {
                  handleClose();
                  handleLogout();
                }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
