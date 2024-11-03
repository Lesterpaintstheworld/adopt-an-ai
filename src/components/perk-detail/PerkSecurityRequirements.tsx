import { FC } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { COLORS } from '../../theme/colors';

interface SecurityRequirements {
  authentication: string[];
  authorization: string[];
  compliance: string[];
  data_protection: string;
  incident_response?: {
    plan: string[];
    procedures: string[];
  };
}

interface PerkSecurityRequirementsProps {
  securityRequirements: SecurityRequirements;
}

export const PerkSecurityRequirements: FC<PerkSecurityRequirementsProps> = ({ securityRequirements }) => {
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
      <Typography variant="h6" gutterBottom>Security Requirements</Typography>

      {securityRequirements.compliance && (
        <Box mt={2}>
          <Typography variant="subtitle1">Compliance:</Typography>
          <List dense>
            {securityRequirements.compliance.map((req, index) => (
              <ListItem key={index}>
                <ListItemText primary={req} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {securityRequirements.authentication && (
        <Box mt={2}>
          <Typography variant="subtitle1">Authentication:</Typography>
          <List dense>
            {securityRequirements.authentication.map((auth, index) => (
              <ListItem key={index}>
                <ListItemText primary={auth} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {securityRequirements.authorization && (
        <Box mt={2}>
          <Typography variant="subtitle1">Authorization:</Typography>
          <List dense>
            {securityRequirements.authorization.map((auth, index) => (
              <ListItem key={index}>
                <ListItemText primary={auth} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {securityRequirements.data_protection && (
        <Box mt={2}>
          <Typography variant="subtitle1">Data Protection:</Typography>
          <Typography variant="body2">{securityRequirements.data_protection}</Typography>
        </Box>
      )}

      {securityRequirements.incident_response && (
        <Box mt={2}>
          <Typography variant="subtitle1">Incident Response:</Typography>
          
          {securityRequirements.incident_response.plan && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Plan:</Typography>
              <List dense>
                {securityRequirements.incident_response.plan.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {securityRequirements.incident_response.procedures && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Procedures:</Typography>
              <List dense>
                {securityRequirements.incident_response.procedures.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
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
import { FC } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { COLORS } from '../../theme/colors';
import { PerkSecurityRequirements as SecurityRequirementsType } from '../../types/perk';

interface PerkSecurityRequirementsProps {
  securityRequirements: SecurityRequirementsType;
}

export const PerkSecurityRequirements: FC<PerkSecurityRequirementsProps> = ({ 
  securityRequirements 
}) => {
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
      <Typography variant="h6" gutterBottom>Security Requirements</Typography>

      {/* Authentication Section */}
      {securityRequirements.authentication && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>Authentication</Typography>
          <List dense>
            {Array.isArray(securityRequirements.authentication) ? (
              securityRequirements.authentication.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={item}
                    primaryTypographyProps={{
                      variant: 'body2'
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText 
                  primary={securityRequirements.authentication}
                  primaryTypographyProps={{
                    variant: 'body2'
                  }}
                />
              </ListItem>
            )}
          </List>
        </Box>
      )}

      {/* Authorization Section */}
      {securityRequirements.authorization && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>Authorization</Typography>
          <List dense>
            {Array.isArray(securityRequirements.authorization) ? (
              securityRequirements.authorization.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={item}
                    primaryTypographyProps={{
                      variant: 'body2'
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText 
                  primary={securityRequirements.authorization}
                  primaryTypographyProps={{
                    variant: 'body2'
                  }}
                />
              </ListItem>
            )}
          </List>
        </Box>
      )}

      {/* Compliance Section */}
      {securityRequirements.compliance && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>Compliance</Typography>
          <List dense>
            {Array.isArray(securityRequirements.compliance) ? (
              securityRequirements.compliance.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={item}
                    primaryTypographyProps={{
                      variant: 'body2'
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText 
                  primary={securityRequirements.compliance}
                  primaryTypographyProps={{
                    variant: 'body2'
                  }}
                />
              </ListItem>
            )}
          </List>
        </Box>
      )}

      {/* Data Protection Section */}
      {securityRequirements.data_protection && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>Data Protection</Typography>
          <Typography variant="body2">
            {securityRequirements.data_protection}
          </Typography>
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
