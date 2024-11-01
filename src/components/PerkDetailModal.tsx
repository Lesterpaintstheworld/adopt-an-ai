import {
  Modal,
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  IconButton,
  Paper,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Mermaid from 'react-mermaid2';
import CloseIcon from '@mui/icons-material/Close';
import { Perk, PerkFullData } from '../types/tech';

interface PerkDetailModalProps {
  open: boolean;
  onClose: () => void;
  perk: Perk | null;
  fullData: PerkFullData | null;
}

const MetricProgress = ({ current, target, label }: { 
  current: string;
  target: string;
  label: string;
}) => {
  const currentValue = parseFloat(current.replace('%', ''));
  const targetValue = parseFloat(target.replace('%', ''));
  const progress = (currentValue / targetValue) * 100;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">
          {current} / {target}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={Math.min(progress, 100)}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: progress >= 100 ? 'success.main' : 'primary.main',
          }
        }}
      />
    </Box>
  );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
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

const PerkDetailModal = ({ open, onClose, perk, fullData }: PerkDetailModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!perk) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="perk-detail-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 1200,
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'auto',
        p: 4,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
              {fullData?.name || perk.name}
            </Typography>
            <Chip label={perk.tag} sx={{ mr: 1 }} />
            <Chip label={`ID: ${fullData?.capability_id || perk.capability_id}`} />
          </Grid>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {fullData?.version_control && (
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Version History</Typography>
                    <Timeline>
                      {fullData.version_control.version_history.map((version, index) => (
                        <TimelineItem key={index}>
                          <TimelineSeparator>
                            <TimelineDot color={index === 0 ? "primary" : "grey"} />
                            {index < fullData.version_control.version_history.length - 1 && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant="subtitle2">
                              Version {version.version} - {version.date}
                            </Typography>
                            <List dense>
                              {version.changes.map((change, changeIndex) => (
                                <ListItem key={changeIndex}>
                                  <ListItemIcon>
                                    <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                                  </ListItemIcon>
                                  <ListItemText primary={change} />
                                </ListItem>
                              ))}
                            </List>
                            <Typography variant="caption" color="textSecondary">
                              Reviewed by: {version.reviewed_by}
                              {version.approved_by && ` | Approved by: ${version.approved_by}`}
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </Paper>
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Description</Typography>
              <Typography variant="body1" paragraph>
                {fullData?.description.long || perk.description}
              </Typography>
            </Paper>
          </Grid>

          {fullData?.technical_specifications && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Technical Specifications</Typography>
                <Typography variant="subtitle1">Core Components:</Typography>
                <List>
                  {fullData.technical_specifications.core_components.map((component, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={component.name}
                        secondary={component.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {fullData?.dependencies && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Dependencies</Typography>
                
                <Typography variant="subtitle1">Prerequisites:</Typography>
                <List>
                  {Object.entries(fullData.dependencies.prerequisites).map(([category, items]) => (
                    <ListItem key={category}>
                      <ListItemText
                        primary={category}
                        secondary={items.join(', ')}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Enables:</Typography>
                <List>
                  {Object.entries(fullData.dependencies.enables).map(([category, items]) => (
                    <ListItem key={category}>
                      <ListItemText
                        primary={category}
                        secondary={items.join(', ')}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {fullData?.risks_and_mitigations && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Risks and Mitigations</Typography>
                
                <Typography variant="subtitle1">Technical Risks:</Typography>
                <List>
                  {fullData.risks_and_mitigations.technical_risks.map((risk, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {risk.risk}
                            <SeverityBadge severity={risk.severity} />
                          </Box>
                        }
                        secondary={`Mitigation: ${risk.mitigation}`}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Ethical Risks:</Typography>
                <List>
                  {fullData.risks_and_mitigations.ethical_risks.map((risk, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={risk.risk}
                        secondary={`Mitigation: ${risk.mitigation}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {fullData?.success_metrics && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Success Metrics</Typography>
                
                <Typography variant="subtitle1" gutterBottom>Operational KPIs:</Typography>
                {fullData.success_metrics.operational_kpis.map((kpi, index) => (
                  <MetricProgress
                    key={index}
                    label={kpi.metric}
                    current={kpi.current}
                    target={kpi.target}
                  />
                ))}
              </Paper>
            </Grid>
          )}

          {/* Monitoring & Maintenance */}
          {fullData?.monitoring_and_maintenance && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Monitoring & Maintenance</Typography>
                
                <Typography variant="subtitle1">Metrics Collection:</Typography>
                <List>
                  {fullData.monitoring_and_maintenance.metrics_collection.map((metric, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={metric} />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Alerts:</Typography>
                <List>
                  {fullData.monitoring_and_maintenance.alerting.map((alert, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={alert} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {/* Future Enhancements */}
          {fullData?.future_enhancements?.planned_upgrades && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Future Enhancements</Typography>
                
                <Typography variant="subtitle1">Short Term:</Typography>
                <List>
                  {fullData.future_enhancements.planned_upgrades.short_term.map((upgrade, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={upgrade} />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Medium Term:</Typography>
                <List>
                  {fullData.future_enhancements.planned_upgrades.medium_term.map((upgrade, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={upgrade} />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Long Term:</Typography>
                <List>
                  {fullData.future_enhancements.planned_upgrades.long_term.map((upgrade, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={upgrade} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {/* Security Requirements */}
          {fullData?.security_requirements && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Security Requirements</Typography>
                
                <Typography variant="subtitle1">Access Control:</Typography>
                <List>
                  {fullData.security_requirements.access_control.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Compliance:</Typography>
                <List>
                  {fullData.security_requirements.compliance.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {fullData?.dependencies_visualization?.primary_diagram && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Dependencies Visualization</Typography>
                <Box sx={{ overflow: 'auto' }}>
                  <Mermaid
                    chart={fullData.dependencies_visualization.primary_diagram}
                  />
                </Box>
              </Paper>
            </Grid>
          )}

          {/* CMMI Assessment */}
          {fullData?.cmmi_assessment && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>CMMI Assessment</Typography>
                <Typography>Current Level: {fullData.cmmi_assessment.current_level}</Typography>
                <Typography>Assessment Date: {fullData.cmmi_assessment.assessment_date}</Typography>
                
                {Object.entries(fullData.cmmi_assessment.process_areas).map(([area, data]: [string, any]) => (
                  <Box key={area} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>{area}:</Typography>
                    <Typography>Maturity: {data.maturity}</Typography>
                    
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Strengths:</Typography>
                    <List dense>
                      {data.strengths.map((strength: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Improvements Needed:</Typography>
                    <List dense>
                      {data.improvements_needed.map((improvement: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemText primary={improvement} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default PerkDetailModal;
