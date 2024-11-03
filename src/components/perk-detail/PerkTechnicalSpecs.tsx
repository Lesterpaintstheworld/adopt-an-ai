import { FC } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { COLORS } from '../../theme/colors';
import { PerkTechnicalSpecification } from '../../types/perk';

interface PerkTechnicalSpecsProps {
  technicalSpecs: PerkTechnicalSpecification;
}

export const PerkTechnicalSpecs: FC<PerkTechnicalSpecsProps> = ({ technicalSpecs }) => {
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
      },
    }}>
      <Typography variant="h6" gutterBottom>Technical Specifications</Typography>
      
      {technicalSpecs?.core_components?.length > 0 && (
        <>
          <Typography variant="subtitle1">Core Components:</Typography>
          <List>
            {technicalSpecs.core_components.map((component, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={component.name}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {component.description}
                      </Typography>
                      {component.features && (
                        <Box mt={1}>
                          <Typography variant="body2" color="textSecondary">
                            Features:
                          </Typography>
                          <List dense>
                            {component.features.map((feature, featureIndex) => (
                              <ListItem key={featureIndex}>
                                <ListItemText
                                  primary={feature}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    color: 'textSecondary'
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      {component.requirements && (
                        <Box mt={1}>
                          <Typography variant="body2" color="textSecondary">
                            Requirements:
                          </Typography>
                          <List dense>
                            {component.requirements.map((req, reqIndex) => (
                              <ListItem key={reqIndex}>
                                <ListItemText
                                  primary={req}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    color: 'textSecondary'
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {technicalSpecs?.performance_metrics && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>Performance Metrics:</Typography>
          <List dense>
            {Object.entries(technicalSpecs.performance_metrics).map(([category, metrics]) => (
              <ListItem key={category}>
                <ListItemText
                  primary={category.charAt(0).toUpperCase() + category.slice(1)}
                  secondary={
                    <List dense>
                      {Object.entries(metrics).map(([key, value]) => (
                        <ListItem key={key}>
                          <ListItemText
                            primary={`${key}: ${value}`}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'textSecondary'
                            }}
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
    </Paper>
  );
};

export default PerkTechnicalSpecs;
