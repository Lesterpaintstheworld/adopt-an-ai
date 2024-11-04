import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const SideMenu = () => {
  return (
    <Box
      component="nav"
      sx={{
        width: 240,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        mt: '64px', // To account for the fixed header height
      }}
    >
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
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideMenu;
