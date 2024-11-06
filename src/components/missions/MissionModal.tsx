import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Mission, Difficulty } from '../types/missions';
import { getPerkIconUrl } from '../utils/iconUtils';
import techTree from '../../content/tech/tech-tree.yml';

const difficultyColors = {
  Beginner: '#2ecc71',
  Intermediate: '#f1c40f',
  Advanced: '#e67e22',
  Expert: '#e74c3c',
};

interface MissionModalProps {
  open: boolean;
  onClose: () => void;
  mission: Mission;
  onStart: (mission: Mission) => void;
  isStarting?: boolean;
}

const MissionModal: React.FC<MissionModalProps> = ({
  open,
  onClose,
  mission,
  onStart,
  isStarting = false,
}) => {
  const getRequiredPerkName = () => {
    return Object.values(techTree)
      .flatMap(phase => 
        Object.entries(phase as Record<string, unknown>)
          .filter(([key]) => !['name', 'period', 'description'].includes(key))
          .flatMap(([_, items]) => (items as Array<{ capability_id: string; name: string }>))
      )
      .find((item): item is { capability_id: string; name: string } => 
        item && 
        typeof item === 'object' && 
        'capability_id' in item && 
        item.capability_id === mission.mainPrerequisite
      )?.name || 'Unknown Perk';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0f1021',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
            {mission.title}
          </Typography>
          <Chip
            label={mission.difficulty}
            size="small"
            sx={{
              bgcolor: difficultyColors[mission.difficulty as Difficulty],
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<TimerIcon />}
            label={mission.duration}
            size="small"
            variant="outlined"
            sx={{ color: 'rgba(255,255,255,0.8)' }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'rgba(255,255,255,0.5)',
            '&:hover': { color: 'rgba(255,255,255,0.8)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Description */}
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.7 }}>
            {mission.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
            {/* Left column */}
            <Box sx={{ flex: 1 }}>
              {/* Objectives */}
              <Typography variant="h6" sx={{ color: '#fff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon /> Objectives
              </Typography>
              <List sx={{ mb: 3 }}>
                {mission.objectives.map((objective, index) => (
                  <ListItem key={index} sx={{ px: 2, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32, color: 'rgba(255,255,255,0.6)' }}>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={objective}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Success Criteria */}
              <Typography variant="h6" sx={{ color: '#fff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon /> Success Criteria
              </Typography>
              <List>
                {mission.success_criteria.map((criterion, index) => (
                  <ListItem key={index} sx={{ px: 2, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32, color: 'rgba(255,255,255,0.6)' }}>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={criterion}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Right column */}
            <Box sx={{ flex: 1 }}>
              {/* Requirements */}
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Requirements</Typography>
              <Box sx={{ mb: 3 }}>
                {mission.mainPrerequisite && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    mb: 2
                  }}>
                    <Box
                      component="img"
                      src={getPerkIconUrl({ 
                        name: getRequiredPerkName(),
                        capability_id: mission.mainPrerequisite 
                      })}
                      alt="Required Perk"
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Required Perk
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        {getRequiredPerkName()}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {Object.entries(mission.requirements).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
                      {key}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Rewards */}
              <Typography variant="h6" sx={{ color: '#fff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon /> Rewards
              </Typography>
              <Box sx={{ mb: 3 }}>
                {mission.rewards.xp && (
                  <Chip 
                    label={`${mission.rewards.xp} XP`}
                    sx={{ 
                      mr: 1, 
                      mb: 1, 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  />
                )}
                {mission.rewards.capabilities?.map((capability, index) => (
                  <Chip 
                    key={index}
                    label={capability}
                    sx={{ 
                      mr: 1, 
                      mb: 1, 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  />
                ))}
              </Box>

              {/* Deliverables */}
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Deliverables</Typography>
              <List>
                {mission.deliverables.map((deliverable, index) => (
                  <ListItem key={index} sx={{ px: 2, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32, color: 'rgba(255,255,255,0.6)' }}>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={deliverable}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={{ 
          p: 3, 
          bgcolor: 'rgba(0,0,0,0.3)', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => onStart(mission)}
            disabled={isStarting || mission.status === 'locked'}
            sx={{
              px: 4,
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' }
            }}
          >
            {isStarting ? 'Starting...' : 'Start Mission'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MissionModal;
