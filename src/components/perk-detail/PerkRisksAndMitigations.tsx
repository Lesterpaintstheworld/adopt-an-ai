import { FC } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { COLORS } from '../../theme/colors';

interface Risk {
  risk: string;
  severity: string;
  mitigation: {
    strategy: string;
    measures: string[];
    monitoring?: {
      metrics: string[];
      alerts: string[];
    };
  };
}

interface RisksAndMitigations {
  technical_risks?: Risk[] | null;
  ethical_risks?: Risk[] | null;
  operational_risks?: {
    [key: string]: Risk[] | null;
  } | null;
}

interface PerkRisksAndMitigationsProps {
  risksAndMitigations: RisksAndMitigations;
}

const SeverityChip: FC<{ severity: string }> = ({ severity }) => {
  const getColor = () => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={severity}
      color={getColor()}
      size="small"
      sx={{ ml: 1 }}
    />
  );
};

const RiskSection: FC<{ title: string; risks: Risk[] }> = ({ title, risks = [] }) => (
  <Box mt={2}>
    <Typography variant="subtitle1" gutterBottom>{title}</Typography>
    <List>
      {risks.map((risk, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {risk.risk}
                <SeverityChip severity={risk.severity} />
              </Box>
            }
            secondary={
              <Box mt={1}>
                <Typography variant="body2" color="textSecondary">
                  Mitigation Strategy: {risk.mitigation.strategy}
                </Typography>
                {risk.mitigation.measures && (
                  <>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      Measures:
                    </Typography>
                    <List dense>
                      {risk.mitigation.measures.map((measure, measureIndex) => (
                        <ListItem key={measureIndex}>
                          <ListItemText
                            primary={measure}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'textSecondary'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
                {risk.mitigation.monitoring && (
                  <Box mt={1}>
                    {risk.mitigation.monitoring.metrics && (
                      <>
                        <Typography variant="body2" color="textSecondary">
                          Monitoring Metrics:
                        </Typography>
                        <List dense>
                          {risk.mitigation.monitoring.metrics.map((metric, metricIndex) => (
                            <ListItem key={metricIndex}>
                              <ListItemText
                                primary={metric}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  color: 'textSecondary'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                    {risk.mitigation.monitoring.alerts && (
                      <>
                        <Typography variant="body2" color="textSecondary">
                          Alerts:
                        </Typography>
                        <List dense>
                          {risk.mitigation.monitoring.alerts.map((alert, alertIndex) => (
                            <ListItem key={alertIndex}>
                              <ListItemText
                                primary={alert}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  color: 'textSecondary'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  </Box>
);

export const PerkRisksAndMitigations: FC<PerkRisksAndMitigationsProps> = ({ risksAndMitigations }) => {
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
      <Typography variant="h6" gutterBottom>Risks and Mitigations</Typography>
      
      {risksAndMitigations.technical_risks?.length > 0 && (
        <RiskSection title="Technical Risks" risks={risksAndMitigations.technical_risks} />
      )}

      {risksAndMitigations.ethical_risks?.length > 0 && (
        <RiskSection title="Ethical Risks" risks={risksAndMitigations.ethical_risks} />
      )}

      {risksAndMitigations.operational_risks && Object.entries(risksAndMitigations.operational_risks).map(([category, risks]) => risks?.length > 0 && (
        <RiskSection 
          key={category}
          title={`${category.charAt(0).toUpperCase() + category.slice(1)} Operational Risks`}
          risks={risks}
        />
      ))}
    </Paper>
  );
};

export default PerkRisksAndMitigations;
