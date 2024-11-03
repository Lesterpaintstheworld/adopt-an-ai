import { FC } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { COLORS } from '../../theme/colors';
import { DependencyItem, DependenciesSection, PerkSecurityRequirements } from '../../types/perk';

interface PerkDependenciesProps {
  data: {
    dependencies?: DependenciesSection;
    dependencies_and_security?: DependenciesSection;
    security_requirements?: PerkSecurityRequirements;
  };
}

const SecuritySection: FC<{ security: PerkSecurityRequirements }> = ({ security }) => (
  <Box mt={3}>
    <Typography variant="subtitle1" gutterBottom>Security Requirements</Typography>
    
    {security.authentication && (
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>Authentication:</Typography>
        <List dense>
          {Array.isArray(security.authentication) ? (
            security.authentication.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={security.authentication} />
            </ListItem>
          )}
        </List>
      </Box>
    )}

    {security.authorization && (
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>Authorization:</Typography>
        <List dense>
          {Array.isArray(security.authorization) ? (
            security.authorization.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={security.authorization} />
            </ListItem>
          )}
        </List>
      </Box>
    )}

    {security.compliance && (
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>Compliance:</Typography>
        <List dense>
          {Array.isArray(security.compliance) ? (
            security.compliance.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={security.compliance} />
            </ListItem>
          )}
        </List>
      </Box>
    )}

    {security.data_protection && (
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>Data Protection:</Typography>
        <Typography variant="body2">{security.data_protection}</Typography>
      </Box>
    )}

    {security.incident_response && (
      <Box mt={2}>
        <Typography variant="subtitle2" gutterBottom>Incident Response:</Typography>
        {security.incident_response.plan && (
          <>
            <Typography variant="body2" gutterBottom>Plan:</Typography>
            <List dense>
              {security.incident_response.plan.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </>
        )}
        {security.incident_response.procedures && (
          <>
            <Typography variant="body2" gutterBottom>Procedures:</Typography>
            <List dense>
              {security.incident_response.procedures.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    )}
  </Box>
);

const DependencyItemComponent: FC<{ name: string; criticality?: string; relationship?: string }> = ({ 
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
      {dependencySection && (
        <Box>
          <Typography variant="h6" gutterBottom>Dependencies</Typography>
          
          {dependencySection.prerequisites && (
            <Box>
              <Typography variant="subtitle1">Prerequisites:</Typography>
              <List>
                {Object.entries(dependencySection.prerequisites).map(([category, items]) => (
                  <ListItem key={category}>
                    <ListItemText
                      primary={category}
                      secondary={
                        <List dense>
                          {items.map((item: string | DependencyItem, index: number) => (
                            <ListItem key={index}>
                              <DependencyItemComponent 
                                name={typeof item === 'object' ? item.capability || '' : item}
                                criticality={typeof item === 'object' ? item.criticality : undefined}
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
            </Box>
          )}

          {dependencySection.enables && (
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Enables:</Typography>
              <List>
                {Object.entries(dependencySection.enables).map(([category, items]) => (
                  <ListItem key={category}>
                    <ListItemText
                      primary={category}
                      secondary={
                        <List dense>
                          {items.map((item: string | DependencyItem, index: number) => (
                            <ListItem key={index}>
                              <DependencyItemComponent 
                                name={typeof item === 'object' ? item.capability || '' : item}
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
            </Box>
          )}
        </Box>
      )}

      {securitySection && (
        <SecuritySection security={securitySection} />
      )}

      {dependencySection?.dependencies_visualization?.primary_diagram && (
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
              {dependencySection.dependencies_visualization.primary_diagram}
            </div>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PerkDependencies;
