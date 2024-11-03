import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { COLORS } from '../../theme/colors';
import ReactJson from 'react-json-view';

interface PerkSecurityRequirementsProps {
  securityRequirements: any;  // Accept any YAML structure
}

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
      
      <ReactJson 
        src={securityRequirements}
        theme="monokai"
        style={{ 
          backgroundColor: 'transparent',
          padding: '8px',
          borderRadius: '4px'
        }}
        displayDataTypes={false}
        enableClipboard={false}
        displayObjectSize={false}
        name={false}
      />

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
