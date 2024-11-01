import {
  Modal,
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Perk, PerkFullData } from '../types/tech';

interface PerkDetailModalProps {
  open: boolean;
  onClose: () => void;
  perk: Perk | null;
  fullData: PerkFullData | null;
}

const PerkDetailModal = ({ open, onClose, perk, fullData }: PerkDetailModalProps) => {
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
      }}>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
              {fullData?.name || perk.name}
            </Typography>
            <Chip label={perk.tag} sx={{ mr: 1 }} />
            <Chip label={`ID: ${fullData?.capability_id || perk.capability_id}`} />
          </Grid>

          {fullData?.version_control && (
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Version Control</Typography>
                <Typography>Current Version: {fullData.version_control.current_version}</Typography>
                <Typography>Last Updated: {fullData.version_control.last_updated}</Typography>
              </Paper>
            </Grid>
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
                        primary={risk.risk}
                        secondary={`Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`}
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
                
                <Typography variant="subtitle1">Operational KPIs:</Typography>
                <List>
                  {fullData.success_metrics.operational_kpis.map((kpi, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={kpi.metric}
                        secondary={`Target: ${kpi.target} | Current: ${kpi.current}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default PerkDetailModal;
