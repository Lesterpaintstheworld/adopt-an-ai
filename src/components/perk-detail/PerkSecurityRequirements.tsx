import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { COLORS } from '../../theme/colors';

interface SecurityRequirement {
  description?: string;
  requirements?: string | string[];
  [key: string]: any;
}

interface PerkSecurityRequirementsProps {
  securityRequirements: {
    data_protection?: string | SecurityRequirement;
    security_standards?: Array<string | SecurityRequirement>;
    security_controls?: Array<string | SecurityRequirement>;
    incident_response?: {
      plan?: string[];
      procedures?: string[];
    };
    [key: string]: any;
  };
}

const renderRequirement = (requirement: string | SecurityRequirement) => {
  if (!requirement) return null;
  
  // Handle string requirements
  if (typeof requirement === 'string') {
    return requirement;
  }
  
  // Handle nested objects
  const renderNestedObject = (obj: any): ReactNode => {
    if (typeof obj === 'string') return obj;
    if (Array.isArray(obj)) {
      return (
        <List dense>
          {obj.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={typeof item === 'string' ? item : renderNestedObject(item)} />
            </ListItem>
          ))}
        </List>
      );
    }
    if (typeof obj === 'object' && obj !== null) {
      return (
        <Box>
          {Object.entries(obj).map(([key, value], index) => (
            <Box key={index} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                {key.replace(/_/g, ' ')}:
              </Typography>
              {renderNestedObject(value)}
            </Box>
          ))}
        </Box>
      );
    }
    return String(obj);
  };

  return (
    <Box>
      {requirement.description && (
        <Typography variant="body2">{requirement.description}</Typography>
      )}
      {requirement.requirements && (
        <Box sx={{ mt: 1 }}>
          {renderNestedObject(requirement.requirements)}
        </Box>
      )}
      {/* Handle other potential nested objects */}
      {Object.entries(requirement)
        .filter(([key]) => !['description', 'requirements'].includes(key))
        .map(([key, value], index) => (
          <Box key={index} sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
              {key.replace(/_/g, ' ')}:
            </Typography>
            {renderNestedObject(value)}
          </Box>
        ))}
    </Box>
  );
};

export const PerkSecurityRequirements: React.FC<PerkSecurityRequirementsProps> = ({
  securityRequirements
}) => {
  return (
    <Paper elevation={2} sx={{
      p: 2,
      bgcolor: COLORS.surface,
      color: COLORS.text.primary
    }}>
      <Typography variant="h6" gutterBottom>Security Requirements</Typography>

      {securityRequirements.data_protection && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Data Protection
          </Typography>
          {renderRequirement(securityRequirements.data_protection)}
        </Box>
      )}

      {securityRequirements.security_standards && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Security Standards
          </Typography>
          <List dense>
            {securityRequirements.security_standards.map((standard, index) => (
              <ListItem key={index}>
                <ListItemText primary={renderRequirement(standard)} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {securityRequirements.security_controls && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Security Controls
          </Typography>
          <List dense>
            {securityRequirements.security_controls.map((control, index) => (
              <ListItem key={index}>
                <ListItemText primary={renderRequirement(control)} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Incident Response Section */}
      {securityRequirements.incident_response && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>Incident Response</Typography>
          
          {securityRequirements.incident_response.plan && (
            <>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                Response Plan
              </Typography>
              <List dense>
                {securityRequirements.incident_response.plan.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{
                        variant: 'body2'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {securityRequirements.incident_response.procedures && (
            <>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                Response Procedures
              </Typography>
              <List dense>
                {securityRequirements.incident_response.procedures.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{
                        variant: 'body2'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default PerkSecurityRequirements;
