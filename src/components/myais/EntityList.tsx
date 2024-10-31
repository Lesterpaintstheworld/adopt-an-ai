import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import { AIEntity } from '../../types/myais';
import { MYAIS_THEME } from '../../theme/myais';

interface EntityListProps {
  entities: Array<AIEntity>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const EntityList: React.FC<EntityListProps> = ({ entities, selectedId, onSelect }) => {
  return (
    <Paper 
      sx={{ 
        height: '100%',
        overflow: 'auto',
        borderRadius: 0,
        backgroundColor: 'background.paper'
      }}
    >
      <Box sx={{ p: MYAIS_THEME.spacing.entityList.padding }}>
        <Typography variant="h6" gutterBottom>
          My AIs
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 1 }}>
        {entities.map((entity) => (
          <ListItem 
            key={entity.id}
            disablePadding
            sx={{ mb: MYAIS_THEME.spacing.entityList.gap }}
          >
            <ListItemButton
              selected={entity.id === selectedId}
              onClick={() => onSelect(entity.id)}
              sx={{
                borderRadius: 1,
                height: MYAIS_THEME.spacing.entityList.itemHeight,
                '&.Mui-selected': {
                  backgroundColor: MYAIS_THEME.colors.entity.selected,
                  '&:hover': {
                    backgroundColor: MYAIS_THEME.colors.entity.selected,
                  }
                },
                '&:hover': {
                  backgroundColor: MYAIS_THEME.colors.entity.hover,
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    border: 1,
                    borderColor: MYAIS_THEME.colors.entity.border
                  }}
                >
                  {entity.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={entity.name}
                secondary={`Stage: ${entity.evolutionStage}`}
                primaryTypographyProps={{
                  variant: 'subtitle1',
                  fontWeight: 500
                }}
                secondaryTypographyProps={{
                  variant: 'body2'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default EntityList;
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import { AIEntity } from '../../types/myais';
import { MYAIS_THEME } from '../../theme/myais';

interface EntityListProps {
  entities: AIEntity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const EntityList: React.FC<EntityListProps> = ({ entities, selectedId, onSelect }) => {
  return (
    <Paper 
      sx={{ 
        height: '100%',
        overflow: 'auto',
        borderRadius: 0,
        backgroundColor: 'background.paper'
      }}
    >
      <Box sx={{ p: MYAIS_THEME.spacing.entityList.padding }}>
        <Typography variant="h6" gutterBottom>
          My AIs
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 1 }}>
        {entities.map((entity) => (
          <ListItem 
            key={entity.id} 
            disablePadding
            sx={{ mb: MYAIS_THEME.spacing.entityList.gap }}
          >
            <ListItemButton
              selected={entity.id === selectedId}
              onClick={() => onSelect(entity.id)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: MYAIS_THEME.colors.entity.selected,
                },
                '&:hover': {
                  backgroundColor: MYAIS_THEME.colors.entity.hover,
                }
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  sx={{ 
                    bgcolor: getAvatarColor(entity.evolutionStage),
                    border: 1,
                    borderColor: MYAIS_THEME.colors.entity.border
                  }}
                >
                  {entity.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={entity.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        textTransform: 'capitalize',
                        color: 'text.secondary'
                      }}
                    >
                      {entity.evolutionStage}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ color: 'text.secondary' }}
                    >
                      • {entity.currentFocus.type}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

// Helper function to get avatar color based on evolution stage
const getAvatarColor = (stage: string): string => {
  const colors = {
    nascent: '#4CAF50',    // Green
    emerging: '#2196F3',   // Blue
    developing: '#9C27B0', // Purple
    maturing: '#FF9800',   // Orange
    advanced: '#F44336',   // Red
  };
  return colors[stage as keyof typeof colors] || '#757575';
};

export default EntityList;
