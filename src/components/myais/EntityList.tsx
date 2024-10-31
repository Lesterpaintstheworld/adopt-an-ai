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
  LinearProgress,
  Paper
} from '@mui/material';
import { AIEntity } from '../../types/myais';

interface EntityListProps {
  entities: AIEntity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const EntityList: React.FC<EntityListProps> = ({ entities, selectedId, onSelect }) => {
  return (
    <Paper sx={{ 
      height: '100%', 
      overflow: 'auto',
      backgroundColor: 'background.paper',
      borderRadius: 0
    }}>
      <List sx={{ padding: 1 }}>
        {entities.map((entity) => (
          <ListItem 
            key={entity.id} 
            disablePadding 
            sx={{ mb: 1 }}
          >
            <ListItemButton 
              selected={selectedId === entity.id}
              onClick={() => onSelect(entity.id)}
              sx={{ 
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.dark',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  src={`/ai-profiles/${entity.id}.png`}
                  alt={entity.name}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="div">
                    {entity.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ width: '100%' }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {`Stage: ${entity.evolutionStage}`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ minWidth: 70 }}>
                        {entity.currentFocus.type}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={entity.currentFocus.progress}
                        sx={{ flexGrow: 1 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        🧠 {entity.consciousness}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        🎨 {entity.creativity}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        🤝 {entity.relationships}
                      </Typography>
                    </Box>
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

export default EntityList;
