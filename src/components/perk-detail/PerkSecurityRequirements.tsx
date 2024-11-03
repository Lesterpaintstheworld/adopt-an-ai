import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { COLORS } from '../../theme/colors';

interface SecurityRequirement {
  description: string;
  requirements: string | string[];
}

interface PerkSecurityRequirementsProps {
  securityRequirements: {
    data_protection?: string | SecurityRequirement;
    security_standards?: Array<string | SecurityRequirement>;
    security_controls?: Array<string | SecurityRequirement>;
    [key: string]: any;
  };
}

const renderRequirement = (requirement: string | SecurityRequirement) => {
  if (typeof requirement === 'string') {
    return requirement;
  }
  
  return (
    <Box>
      <Typography variant="body2">{requirement.description}</Typography>
      {Array.isArray(requirement.requirements) ? (
        <List dense>
          {requirement.requirements.map((req, index) => (
            <ListItem key={index}>
              <ListItemText primary={req} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {requirement.requirements}
        </Typography>
      )}
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
