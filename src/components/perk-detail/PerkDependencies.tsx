import { FC } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { COLORS } from '../../theme/colors';
import { PerkDependencies as PerkDependenciesType } from '../../types/perk';

interface PerkDependenciesProps {
  dependencies: PerkDependenciesType;
}

const DependencyItem: FC<{ name: string; criticality?: string; relationship?: string }> = ({ 
  name, 
  criticality, 
  relationship 
}) => {
  const getChipColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return { bgcolor: '#d32f2f', color: '#ffffff' };
      case 'medium':
        return { bgcolor: '#f57c00', color: '#ffffff' };
      case 'low':
        return { bgcolor: '#388e3c', color: '#ffffff' };
      default:
        return { bgcolor: '#757575', color: '#ffffff' };
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2">{name}</Typography>
      {criticality && (
        <Chip 
          label={criticality}
          size="small"
          sx={{ ...getChipColor(criticality) }}
        />
      )}
      {relationship && (
        <Typography 
          variant="body2" 
          sx={{ color: COLORS.text.secondary }}
        >
          ({relationship})
        </Typography>
      )}
    </Box>
  );
};

export const PerkDependencies: FC<PerkDependenciesProps> = ({ data }) => {
  // Get the appropriate section based on what's available
  const dependencySection = data.dependencies_and_security || data.dependencies;
  const securitySection = data.dependencies_and_security?.security || data.security_requirements;

  if (!dependencySection && !securitySection) return null;
  return (
    <Paper elevation={2} sx={{ 
      p: 2,
      bgcolor: COLORS.surface,
      color: COLORS.text.primary,
      '& .MuiTypography-root': {
        color: COLORS.text.primary,
      },
      '& .MuiListItemText-primary': {
        color: COLORS.text.primary,
      },
      '& .MuiListItemText-secondary': {
        color: COLORS.text.secondary,
      }
    }}>
      <Typography variant="h6" gutterBottom>Dependencies</Typography>
      
      {dependencies.prerequisites && (
        <>
          <Typography variant="subtitle1">Prerequisites:</Typography>
          <List>
            {Object.entries(dependencies.prerequisites).map(([category, items]) => (
              <ListItem key={category}>
                <ListItemText
                  primary={category}
                  secondary={
                    <List dense>
                      {items.map((item: any, index: number) => (
                        <ListItem key={index}>
                          <DependencyItem 
                            name={typeof item === 'object' ? item.capability : item}
                            criticality={typeof item === 'object' ? item.criticality : undefined}
                          />
                        </ListItem>
                      ))}
                    </List>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {dependencies.enables && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Enables:</Typography>
          <List>
            {Object.entries(dependencies.enables).map(([category, items]) => (
              <ListItem key={category}>
                <ListItemText
                  primary={category}
                  secondary={
                    <List dense>
                      {items.map((item: any, index: number) => (
                        <ListItem key={index}>
                          <DependencyItem 
                            name={typeof item === 'object' ? item.capability : item}
                            relationship={typeof item === 'object' ? item.relationship : undefined}
                          />
                        </ListItem>
                      ))}
                    </List>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {dependencies.dependencies_visualization?.primary_diagram && (
        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>Dependencies Visualization</Typography>
          <Box 
            sx={{ 
              bgcolor: 'rgba(0, 0, 0, 0.1)', 
              p: 2, 
              borderRadius: 1,
              '& .mermaid': {
                background: 'transparent'
              }
            }}
          >
            <div className="mermaid">
              {dependencies.dependencies_visualization.primary_diagram}
            </div>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PerkDependencies;
