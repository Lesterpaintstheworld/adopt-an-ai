import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
        {[
          { text: 'Governance', path: '/governance' },
          { text: 'Missions', path: '/missions' },
          { text: 'My Team', path: '/team' },
          { text: 'OS', path: '/os' },
          { text: 'Training', path: '/training' },
          { text: 'GPUs', path: '/gpus' },
        ].map((item) => (
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
              <ListItemText 
                primary={item.text} 
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  transition: 'opacity 0.2s',
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
