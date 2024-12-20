import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const menuItems = [
  { text: 'DAOs', path: '/daos', icon: '/images/daos.png' },
  { text: 'Missions', path: '/missions', icon: '/images/missions.png' },
  { text: 'Teams', path: '/teams', icon: '/images/teams.png' },
  { text: 'Agents', path: '/agents', icon: '/images/agents.png' },
  { text: 'Models', path: '/models', icon: '/images/models.png' },
  { text: 'GPUs', path: '/gpus', icon: '/images/gpus.png' },
];

const SideMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      component="nav"
      sx={{
        width: isCollapsed ? 60 : 'auto',
        maxWidth: isCollapsed ? 60 : 300,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64,
        backgroundColor: 'background.paper',
        transition: 'width 0.2s',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0))',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            disablePadding
            sx={{
              borderBottom: '1px solid',
              borderColor: 'rgba(0, 163, 255, 0.1)'
            }}
          >
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: 2.5,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={item.icon}
                alt={item.text}
                sx={{
                  width: '60px',
                  height: '40px',
                  objectFit: 'contain',
                  mr: isCollapsed ? 0 : 0.5,
                  transition: 'margin 0.2s',
                  objectPosition: 'left',
                  flexShrink: 0,
                  maxWidth: '100%',
                }}
              />
              <ListItemText 
                primary={item.text} 
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  transition: 'opacity 0.2s',
                  display: isCollapsed ? 'none' : 'block',
                  flexShrink: 0,
                  ml: 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideMenu;
