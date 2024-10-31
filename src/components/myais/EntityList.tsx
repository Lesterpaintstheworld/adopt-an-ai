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
  Divider,
  LinearProgress
} from '@mui/material';

interface ProgressBarProps {
  value: number;
  type: string;
}

const EntityProgressBar: React.FC<ProgressBarProps> = ({ value, type }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
    <Typography variant="caption" sx={{ minWidth: 70 }}>
      {type}
    </Typography>
    <LinearProgress 
      variant="determinate" 
      value={value}
      sx={{ 
        flexGrow: 1,
        backgroundColor: MYAIS_THEME.colors.progressBar.background,
        '& .MuiLinearProgress-bar': {
          backgroundColor: MYAIS_THEME.colors.progressBar.fill
        }
      }}
    />
  </Box>
);
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
                height: 'auto',
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
                  src={`/ai-profiles/${entity.id}.png`}
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
                secondary={
                  <Box sx={{ width: '100%' }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {`Stage: ${entity.evolutionStage}`}
                    </Typography>
                    <EntityProgressBar
                      type={entity.currentFocus.type}
                      value={entity.currentFocus.progress}
                    />
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
                primaryTypographyProps={{
                  variant: 'subtitle1',
                  fontWeight: 500
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
