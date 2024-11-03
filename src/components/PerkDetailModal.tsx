import { useState, useEffect, FC } from 'react';
import { SxProps } from '@mui/system';

interface IconLoaderProps {
  perk: { capability_id?: string; name?: string };
  onClick?: () => void;
  sx?: SxProps;
}

const IconLoader: FC<IconLoaderProps> = ({ perk, onClick, sx }) => {
  const [iconUrl, setIconUrl] = useState('/default-perk-icon.png');

  useEffect(() => {
    getPerkIconUrl(perk).then(setIconUrl);
  }, [perk]);

  return (
    <Box 
      component="img"
      src={iconUrl}
      alt={perk?.name || ''}
      sx={sx}
      onClick={onClick}
    />
  );
};
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import mermaid from 'mermaid';
import { Perk, PerkFullData } from '../types/tech';

interface PerkDescription {
  description: string;
  requirements?: string[] | string;
  long?: string;
  short?: string;
}

const getDescription = (perk: Perk | null, fullData: PerkFullData | null): string => {
  // Helper function to handle object descriptions
  const handleObjectDescription = (desc: any): string => {
    if ('description' in desc && 'requirements' in desc) {
      const requirements = Array.isArray(desc.requirements) 
        ? desc.requirements.join(', ')
        : desc.requirements;
      return `${desc.description}\n\nRequirements: ${requirements}`;
    }
    if ('long' in desc) return desc.long;
    if ('short' in desc) return desc.short;
    if ('description' in desc) return desc.description;
    return JSON.stringify(desc); // Fallback for unknown object structure
  };

  // Try fullData first
  if (fullData?.longDescription) {
    return fullData.longDescription;
  }

  if (fullData?.description) {
    if (typeof fullData.description === 'object') {
      return handleObjectDescription(fullData.description);
    }
    return String(fullData.description);
  }

  // Then try perk data
  if (perk?.description) {
    if (typeof perk.description === 'object') {
      return handleObjectDescription(perk.description);
    }
    return String(perk.description);
  }

  if (perk?.shortDescription) {
    return perk.shortDescription;
  }

  return 'No description available.';
};

export const getPerkIconUrl = (perk: { capability_id?: string; name?: string }) => {
  if (!perk?.capability_id) {
    return '/default-perk-icon.png'; // Fallback icon
  }

  // Try to load the specific perk icon
  const iconUrl = `/perk-icons/${perk.capability_id}.png`;

  // Create an image element to test if the icon exists
  const img = new Image();
  img.src = iconUrl;

  // Return either the specific icon URL or fallback
  return new Promise<string>((resolve) => {
    img.onload = () => resolve(iconUrl);
    img.onerror = () => resolve('/default-perk-icon.png');
  });
};

const formatDateValue = (value: any): string => {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  }
  return String(value);
};

const COLORS = {
  background: '#121212',        // Fond noir
  surface: '#242424',          // Box grises
  primary: '#007FFF',          // Bleu pour les accents
  secondary: '#0059B2',        // Bleu foncé
  text: {
    primary: '#FFFFFF',        // Texte blanc
    secondary: '#CCCCCC'       // Texte gris clair
  }
};

const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle Date objects
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  // Handle date strings
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    try {
      const date = new Date(value);
      return date.toLocaleDateString();
    } catch {
      return value;
    }
  }
  
  if (typeof value === 'object') {
    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(item => formatValue(item)).join(', ');
    }
    
    // Handle objects with description and requirements
    if (value.description && value.requirements) {
      return `${value.description}\nRequirements: ${formatValue(value.requirements)}`;
    }
    
    // Handle objects with description and features
    if (value.description && value.features) {
      return `${value.description}\nFeatures: ${formatValue(value.features)}`;
    }
    
    // If it's an object with a single key that starts with "Phase"
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0].startsWith('Phase')) {
      return `${keys[0]}: ${formatValue(value[keys[0]])}`;
    }
    
    // Handle specific object structures
    if (value.strategy && value.phases) {
      return `Strategy: ${value.strategy}, Phases: ${formatValue(value.phases)}`;
    }
    if (value.current && value.target) {
      return `Current: ${formatValue(value.current)}, Target: ${formatValue(value.target)}`;
    }
    
    try {
      return Object.entries(value)
        .map(([key, val]) => `${key}: ${formatValue(val)}`)
        .join(', ');
    } catch {
      return String(value);
    }
  }
  
  return String(value);
};
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Fab,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import LaunchIcon from '@mui/icons-material/Launch';
import RestoreIcon from '@mui/icons-material/Restore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';

interface PerkDetailModalProps {
  open: boolean;
  onClose: () => void;
  perk: Perk | null;
  fullData: PerkFullData | null;
}

const MetricProgress = ({ current, target, label }: { 
  current: string | number | Date;
  target: string | number | Date;
  label: string;
}) => {
  const parseValue = (value: string | number | Date): number => {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    const stringValue = String(value);
    return parseFloat(stringValue.replace('%', '')) || 0;
  };

  const currentValue = parseValue(current);
  const targetValue = parseValue(target);
  const progress = targetValue !== 0 ? (currentValue / targetValue) * 100 : 0;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">
          {formatDateValue(current)} / {formatDateValue(target)}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={Math.min(progress, 100)}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: `${COLORS.primary}33`,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: progress >= 100 ? COLORS.secondary : COLORS.primary,
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

const MermaidDiagram = ({ diagram }: { diagram: string }) => {
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const renderDiagram = async () => {
      try {
        await mermaid.contentLoaded();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error rendering diagram');
        console.error('Mermaid render error:', err);
      }
    };
    
    renderDiagram();
  }, [diagram]);
  
  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        <Typography variant="body2">Failed to render diagram: {error}</Typography>
      </Box>
    );
  }
  
  return (
    <div className="mermaid">
      {diagram}
    </div>
  );
};

const PerkDetailModal = ({ open, onClose, perk, fullData }: PerkDetailModalProps) => {
  console.log("PerkDetailModal props:", { open, perk, fullData });

  useEffect(() => {
    if (open && perk) {
      console.log('Modal opened with perk:', perk);
      console.log('Full data:', fullData);
    }
  }, [open, perk, fullData]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [mermaidInitialized, setMermaidInitialized] = useState(false);
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isVersionHistoryExpanded, setIsVersionHistoryExpanded] = useState(false);

  useEffect(() => {
    if (!open || !perk?.capability_id) return;
    
    const loadDetails = async () => {
      setIsLoadingDetails(true);
      try {
        // Any additional data loading can go here
      } catch (error) {
        console.error('Error loading perk details:', error);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    loadDetails();
  }, [open, perk?.capability_id]);

  useEffect(() => {
    // Remove console logging of modal data
  }, [perk, fullData]);

  useEffect(() => {
    if (!open || !fullData?.dependencies_visualization?.primary_diagram || mermaidInitialized) {
      return;
    }

    const initializeMermaid = async () => {
      setIsLoading(true);
      try {
        await mermaid.initialize({
          theme: 'default',
          securityLevel: 'loose',
          startOnLoad: true
        });
        await mermaid.contentLoaded();
        setMermaidInitialized(true);
      } catch (error) {
        setMermaidError(error instanceof Error ? error.message : 'Error initializing diagram');
        console.error('Mermaid initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMermaid();
  }, [open, fullData?.dependencies_visualization?.primary_diagram, mermaidInitialized]);

  useEffect(() => {
    if (!open) {
      setMermaidInitialized(false);
      setMermaidError(null);
    }
  }, [open]);
  
  if (!perk) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="perk-detail-modal"
      sx={{
        '& .MuiModal-backdrop': {
          backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker backdrop
        },
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
          xs: '95%', // Mobile
          sm: '80%'  // Desktop
        },
        maxWidth: 1200,
        maxHeight: '90vh',
        bgcolor: COLORS.background,
        color: COLORS.text.primary,
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'auto',
        p: {
          xs: 2,  // Mobile
          sm: 4   // Desktop
        },
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: COLORS.surface,
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: COLORS.primary,
          borderRadius: '4px',
          '&:hover': {
            background: COLORS.secondary,
          },
        },
      }}>
        <IconButton
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: COLORS.primary,
            '&:hover': {
              color: COLORS.secondary,
            },
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={{ xs: 1, sm: 3 }} sx={{ mb: 2 }}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {perk && (
              <IconLoader
                perk={perk}
                onClick={() => setIsImageOpen(true)}
                sx={{ 
                  width: {
                    xs: 80,    // Mobile
                    sm: 160    // Desktop
                  },
                  height: {
                    xs: 80,    // Mobile
                    sm: 160    // Desktop
                  },
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': {
                    opacity: 0.8,
                  }
                }}
              />
            )}
            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                sx={{
                  fontSize: {
                    xs: '1.5rem',  // Mobile
                    sm: '2.125rem' // Desktop
                  }
                }}
              >
                {fullData?.name || perk?.name || ''}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={perk?.tag || ''} 
                  sx={{ 
                    bgcolor: COLORS.primary,
                    color: COLORS.background,
                  }} 
                />
                <Chip 
                  label={`ID: ${fullData?.capability_id || perk?.capability_id || ''}`}
                  sx={{ 
                    bgcolor: '#FFA500',
                    color: '#000000',
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {fullData?.version_control?.version_history && fullData.version_control.version_history.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ 
                    p: 2,
                    bgcolor: COLORS.surface,
                    color: COLORS.text.primary,
                  }}>
                    <Accordion 
                      expanded={isVersionHistoryExpanded}
                      onChange={() => setIsVersionHistoryExpanded(!isVersionHistoryExpanded)}
                      sx={{
                        bgcolor: 'transparent',
                        '&:before': {
                          display: 'none',
                        },
                        '& .MuiAccordionSummary-root': {
                          minHeight: '48px',
                          '&.Mui-expanded': {
                            minHeight: '48px',
                          }
                        },
                        '& .MuiAccordionSummary-content': {
                          margin: '12px 0',
                          '&.Mui-expanded': {
                            margin: '12px 0',
                          }
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: COLORS.text.primary }} />}
                        sx={{ p: 0 }}
                      >
                        <Typography variant="h6">Version History</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0, pt: 1 }}>
                        <Timeline sx={{ 
                          [`& .MuiTimelineItem-root:before`]: {
                            flex: 0,
                            padding: 0
                          }
                        }}>
                          {fullData?.version_control?.version_history?.map((version, index) => (
                            <TimelineItem key={index} sx={{ minHeight: 'auto' }}>
                              <TimelineSeparator>
                                <TimelineDot 
                                  color={index === 0 ? "primary" : "grey"} 
                                  sx={{ my: 0.5 }}
                                />
                                {index < (fullData?.version_control?.version_history?.length ?? 0) - 1 && (
                                  <TimelineConnector />
                                )}
                              </TimelineSeparator>
                              <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                  Version {formatValue(version.version)} - {formatValue(version.date)}
                                </Typography>
                                <List dense sx={{ py: 0 }}>
                                  {version.changes.map((change, changeIndex) => (
                                    <ListItem key={changeIndex} sx={{ py: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 24 }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={change}
                                        primaryTypographyProps={{
                                          variant: 'body2',
                                          sx: { color: COLORS.text.secondary }
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: COLORS.text.secondary,
                                    display: 'block',
                                    mt: 0.5 
                                  }}
                                >
                                  Reviewed by: {formatValue(version.reviewed_by)}
                                  {version.approved_by && ` | Approved by: ${formatValue(version.approved_by)}`}
                                </Typography>
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12}>
            <Paper elevation={2} sx={{ 
              p: {
                xs: 1,  // Mobile
                sm: 2   // Desktop
              },
              bgcolor: COLORS.surface,
              color: COLORS.text.primary,
              '& .MuiTypography-root': {
                color: COLORS.text.primary,
              }
            }}>
              <Typography variant="h6" gutterBottom>Description</Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}
              >
                {getDescription(perk, fullData)}
              </Typography>
            </Paper>
          </Grid>

          {fullData?.technical_specifications?.core_components && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ 
                p: 2,
                bgcolor: COLORS.surface,     // Box grises
                color: COLORS.text.primary, // Ensure text is white
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
                {fullData?.technical_specifications?.core_components?.length > 0 && (
                  <>
                    <Typography variant="subtitle1">Core Components:</Typography>
                    <List>
                      {fullData.technical_specifications?.core_components?.map((component, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={component.name}
                            secondary={component.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </Grid>
          )}

          {fullData?.dependencies?.prerequisites && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ 
                p: 2,
                bgcolor: COLORS.surface,     // Box grise
                color: COLORS.text.primary,  // Texte blanc
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
                
                {fullData?.dependencies?.prerequisites && (
                  <>
                    <Typography variant="subtitle1">Prerequisites:</Typography>
                    <List>
                      {Object.entries(fullData.dependencies.prerequisites).map(([category, items]) => (
                        <ListItem key={category}>
                          <ListItemText
                            primary={category}
                            secondary={
                              Array.isArray(items) ? 
                                items.map((item: { capability?: string; criticality?: string } | string) => {
                                  if (typeof item === 'object' && 'capability' in item) {
                                    return item.capability + (item.criticality ? ` (${item.criticality})` : '');
                                  }
                                  return String(item);
                                }).join(', ')
                                : 'Invalid format'
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                <Divider sx={{ my: 2 }} />

                {fullData.dependencies.enables && (
                  <>
                    <Typography variant="subtitle1">Enables:</Typography>
                    <List>
                      {Object.entries(fullData.dependencies.enables).map(([category, items]) => (
                        <ListItem key={category}>
                          <ListItemText
                            primary={category}
                            secondary={
                              Array.isArray(items) ? 
                                items.map(item => {
                                  if (typeof item === 'object') {
                                    return `${item.capability}${item.relationship ? ` (${item.relationship})` : ''}`;
                                  }
                                  return item;
                                }).join(', ')
                                : 'Invalid format'
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </Grid>
          )}

          {fullData?.risks_and_mitigations?.technical_risks && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ 
                p: 2,
                bgcolor: COLORS.surface,     // Box grise
                color: COLORS.text.primary,  // Texte blanc
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
                <Typography variant="h6" gutterBottom>Risks and Mitigations</Typography>
                
                {fullData?.risks_and_mitigations?.technical_risks?.length > 0 && (
                  <>
                    <Typography variant="subtitle1">Technical Risks:</Typography>
                    <List>
                      {fullData.risks_and_mitigations.technical_risks.map((risk, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={
                              <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                {risk.risk}
                                <SeverityBadge severity={risk.severity} />
                              </Box>
                            }
                            secondary={`Mitigation: ${risk.mitigation}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                <Divider sx={{ my: 2 }} />

                {fullData?.risks_and_mitigations?.ethical_risks && 
                 fullData.risks_and_mitigations.ethical_risks.length > 0 && (
                  <>
                    <Typography variant="subtitle1">Ethical Risks:</Typography>
                    <List>
                      {fullData?.risks_and_mitigations?.ethical_risks?.map((risk, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={risk.risk}
                            secondary={`Mitigation: ${risk.mitigation}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </Grid>
          )}

          {fullData?.success_metrics?.operational_kpis && fullData.success_metrics.operational_kpis.length > 0 && (
            <Grid item xs={12} md={6}>
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
          {fullData && fullData.monitoring_and_maintenance?.metrics_collection && 
           fullData.monitoring_and_maintenance.metrics_collection.length > 0 && (
            <Grid item xs={12} md={6}>
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
                '& .MuiTableCell-root': {
                  color: COLORS.text.primary,
                },
                '& .MuiListItemIcon-root': {
                  color: COLORS.text.primary,
                }
              }}>
                <Typography variant="h6" gutterBottom>Monitoring & Maintenance</Typography>
                
                <Typography variant="subtitle1">Metrics Collection:</Typography>
                <List>
                  {fullData && fullData.monitoring_and_maintenance?.metrics_collection?.map((metric: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={metric} />
                    </ListItem>
                  ))}
                </List>

                {fullData && fullData.monitoring_and_maintenance?.alerting && 
                 fullData.monitoring_and_maintenance.alerting.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">Alerts:</Typography>
                    <List>
                      {fullData && fullData.monitoring_and_maintenance?.alerting?.map((alert: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemText primary={alert} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
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
                  {fullData.future_enhancements.planned_upgrades.short_term.map((upgrade: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={upgrade} />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Medium Term:</Typography>
                <List>
                  {fullData.future_enhancements.planned_upgrades.medium_term.map((upgrade: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={upgrade} />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Long Term:</Typography>
                <List>
                  {fullData.future_enhancements.planned_upgrades.long_term.map((upgrade: string, index: number) => (
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
                
                {fullData.security_requirements.access_control && Array.isArray(fullData.security_requirements.access_control) && (
                  <>
                    <Typography variant="subtitle1">Access Control:</Typography>
                    <List>
                      {fullData.security_requirements.access_control.map((req: string | Record<string, any>, index: number) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={typeof req === 'object' ? JSON.stringify(req) : String(req)}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {fullData.security_requirements.compliance && (
                  <>
                    <Typography variant="subtitle1">Compliance:</Typography>
                    <List>
                      {Array.isArray(fullData.security_requirements.compliance) 
                        ? fullData.security_requirements.compliance.map((req: string | Record<string, any>, index: number) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={typeof req === 'object' ? JSON.stringify(req) : String(req)}
                              />
                            </ListItem>
                          ))
                        : (
                          <ListItem>
                            <ListItemText 
                              primary={typeof fullData.security_requirements.compliance === 'object' 
                                ? JSON.stringify(fullData.security_requirements.compliance)
                                : String(fullData.security_requirements.compliance)}
                            />
                          </ListItem>
                        )
                      }
                    </List>
                  </>
                )}

                {fullData.security_requirements.authentication && (
                  <>
                    <Typography variant="subtitle1">Authentication:</Typography>
                    <Typography variant="body1">{fullData.security_requirements.authentication}</Typography>
                  </>
                )}

                {fullData.security_requirements.authorization && (
                  <>
                    <Typography variant="subtitle1">Authorization:</Typography>
                    <Typography variant="body1">{fullData.security_requirements.authorization}</Typography>
                  </>
                )}

                {fullData.security_requirements.data_protection && (
                  <>
                    <Typography variant="subtitle1">Data Protection:</Typography>
                    <Typography variant="body1">{fullData.security_requirements.data_protection}</Typography>
                  </>
                )}
              </Paper>
            </Grid>
          )}

          {fullData?.dependencies_visualization?.primary_diagram && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Dependencies Visualization</Typography>
                <Box sx={{ overflow: 'auto' }}>
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <MermaidDiagram diagram={fullData.dependencies_visualization.primary_diagram} />
                  )}
                </Box>
              </Paper>
            </Grid>
          )}

          {/* CMMI Assessment */}
          {fullData?.cmmi_assessment?.process_areas && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ 
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.75)',
                color: COLORS.text.primary,
                '& .MuiTypography-root': {
                  color: COLORS.text.primary,
                },
                '& .MuiAccordion-root': {
                  bgcolor: 'rgba(45, 45, 45, 0.95)',
                  color: COLORS.text.primary,
                },
                '& .MuiAccordionSummary-root': {
                  color: COLORS.text.primary,
                },
                '& .MuiAccordionDetails-root': {
                  color: COLORS.text.primary,
                },
                '& .MuiListItemText-primary': {
                  color: COLORS.text.primary,
                },
                '& .MuiListItemText-secondary': {
                  color: COLORS.text.secondary,
                }
              }}>
                <Typography variant="h6" gutterBottom>CMMI Assessment</Typography>
                {fullData?.cmmi_assessment?.current_level && (
                  <Typography>Current Level: {fullData.cmmi_assessment.current_level}</Typography>
                )}
                {fullData?.cmmi_assessment?.assessment_date && (
                  <Typography>Assessment Date: {formatValue(fullData.cmmi_assessment.assessment_date)}</Typography>
                )}
                
                {Object.entries(fullData.cmmi_assessment.process_areas).map(([area, data]: [string, any]) => data && (
                  <Box key={area} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>{area}:</Typography>
                    <Typography>Maturity: {data.maturity}</Typography>
                    
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Strengths:</Typography>
                    <List dense>
                      {data.strengths?.map((strength: any, index: number) => (
                        <ListItem key={index}>
                          <ListItemText primary={formatValue(strength)} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Improvements Needed:</Typography>
                    <List dense>
                      {data.improvements_needed?.map((improvement: any, index: number) => (
                        <ListItem key={index}>
                          <ListItemText primary={formatValue(improvement)} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Paper>
            </Grid>
          )}

          {fullData?.technical_specifications?.core_components && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ 
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.75)',
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
                '& .MuiTableCell-root': {
                  color: COLORS.text.primary,
                }
              }}>
                <Typography variant="h6" gutterBottom>Technical Specifications</Typography>
                
                <Accordion sx={{
                  bgcolor: COLORS.surface,
                  color: COLORS.text.primary,
                  '& .MuiAccordionSummary-root': {
                    color: COLORS.text.primary,
                  },
                  '& .MuiAccordionDetails-root': {
                    color: COLORS.text.primary,
                  }
                }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Core Components</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Performance Metrics</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer sx={{ 
                      overflowX: 'auto',
                      '& table': {
                        minWidth: {
                          xs: '100%',
                          sm: 'auto'
                        }
                      }
                    }}>
                      <Table size="small">
                        <TableBody>
                          {fullData.technical_specifications.performance_metrics && Object.entries(fullData.technical_specifications.performance_metrics).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell 
                                component="th" 
                                scope="row"
                                sx={{
                                  color: COLORS.text.primary,
                                }}
                              >
                                {key}
                              </TableCell>
                              <TableCell>
                                {formatValue(value)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Grid>
          )}

          {fullData?.documentation && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ 
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.75)',
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
                '& .MuiListItemIcon-root': {
                  color: COLORS.text.primary,
                }
              }}>
                <Typography variant="h6" gutterBottom>Documentation</Typography>
                
                {fullData?.documentation?.technical_docs && fullData.documentation.technical_docs.length > 0 && (
                  <>
                    <Typography variant="subtitle1" sx={{ color: COLORS.text.primary }}>Technical Documentation:</Typography>
                    <List dense>
                      {fullData.documentation?.technical_docs?.map((doc: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <DescriptionIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={<Typography color={COLORS.text.primary}>{doc}</Typography>}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {fullData?.documentation?.training_materials && fullData.documentation.training_materials.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">Training Materials:</Typography>
                    <List dense>
                      {fullData.documentation?.training_materials?.map((material: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <SchoolIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={material} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </Grid>
          )}

          {fullData?.deployment && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ 
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.75)',
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
                '& .MuiListItemIcon-root': {
                  color: COLORS.text.primary,
                }
              }}>
                <Typography variant="h6" gutterBottom>Deployment</Typography>
                
                <Typography variant="subtitle1">Strategies:</Typography>
                <List dense>
                  {fullData.deployment.strategies.map((strategy: { strategy?: string; phases?: string[] } | string, index: number) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <LaunchIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={typeof strategy === 'string' ? strategy : strategy.strategy}
                        secondary={typeof strategy === 'object' && strategy.phases && (
                          <List dense>
                            {strategy.phases.map((phase: string, phaseIndex: number) => (
                              <ListItem key={phaseIndex}>
                                <ListItemText primary={phase} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Rollback Procedures:</Typography>
                <List dense>
                  {fullData.deployment.rollback_procedures.map((procedure, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <RestoreIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={formatValue(procedure)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Dialog
          open={isImageOpen}
          onClose={() => setIsImageOpen(false)}
          maxWidth={false}
          PaperProps={{
            sx: {
              bgcolor: COLORS.background,
              color: COLORS.text.primary,
              boxShadow: 'none',
              borderRadius: 2,
              width: '90vw',
              height: '90vh',
              maxWidth: '1600px',
              maxHeight: '1200px'
            },
          }}
        >
          <DialogContent
            sx={{
              bgcolor: COLORS.background,
              p: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: COLORS.surface,
              },
              '&::-webkit-scrollbar-thumb': {
                background: COLORS.primary,
                borderRadius: '4px',
                '&:hover': {
                  background: COLORS.secondary,
                },
              },
            }}
          >
            <Box
              component="img"
              src={getPerkIconUrl(perk)}
              alt={perk.name}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </DialogContent>
        </Dialog>

        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: COLORS.primary,
            color: COLORS.background,
            '&:hover': {
              bgcolor: COLORS.secondary,
            },
          }}
          onClick={() => {
            const modalElement = document.querySelector('[role="dialog"]');
            if (modalElement) modalElement.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Modal>
  );
};

export default PerkDetailModal;
