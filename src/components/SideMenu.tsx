import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const menuItems = [
  { text: 'Governance', path: '/governance', icon: '/images/governance.png' },
  { text: 'Missions', path: '/missions', icon: '/images/missions.png' },
  { text: 'My Team', path: '/team', icon: '/images/team.png' },
  { text: 'OS', path: '/os', icon: '/images/os.png' },
  { text: 'Training', path: '/training', icon: '/images/training.png' },
  { text: 'GPUs', path: '/gpus', icon: '/images/gpus.png' },
];

const SideMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      component="nav"
      sx={{
        width: isCollapsed ? 60 : 240,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: 'calc(100vh - 64px)', // Hauteur totale moins la hauteur du header
        position: 'sticky',
        top: 64, // Hauteur du header
        backgroundColor: 'background.paper',
        transition: 'width 0.2s',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
              }}
            >
              <Box
                component="img"
                src={item.icon}
                alt={item.text}
                sx={{
                  width: '100px',
                  height: '20px',
                  objectFit: 'contain',
                  mr: isCollapsed ? 0 : 2,
                  transition: 'margin 0.2s',
                }}
              />
              <ListItemText 
                primary={item.text} 
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  transition: 'opacity 0.2s',
                  display: isCollapsed ? 'none' : 'block',
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
