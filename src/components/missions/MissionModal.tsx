import React, { useState } from 'react';
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
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Mission, Difficulty } from '../../types/missions';
import { getPerkIconUrl } from '../../utils/iconUtils';
import techTree from 'content/tech-tree/tech-tree.yml';

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
  onStart: (mission: Mission & { instructions?: string }) => void;
  isStarting?: boolean;
}

const MissionModal: React.FC<MissionModalProps> = ({
  open,
  onClose,
  mission,
  onStart,
  isStarting = false,
}) => {
  const [instructions, setInstructions] = useState<string>('');

  const handleStartMission = () => {
    onStart({ ...mission, instructions });
  };
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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0f1021',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          borderRadius: '12px',
          minHeight: '80vh',
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

      <DialogContent sx={{ p: 0, display: 'flex', height: '100%' }}>
        {/* Left column - Mission details */}
        <Box sx={{ 
          flex: 1, 
          p: 3, 
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          overflowY: 'auto'
        }}>
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
                {mission.objectives.map((objective: string, index: number) => (
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
                {mission.success_criteria.map((criterion: string, index: number) => (
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
                      {String(value)}
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
                {mission.rewards.capabilities?.map((capability: string, index: number) => (
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
                {mission.deliverables.map((deliverable: string, index: number) => (
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

        {/* Right column - Instructions */}
        <Box sx={{ 
          flex: 1, 
          p: 3,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            Instructions spécifiques
          </Typography>
          
          <TextField
            multiline
            rows={12}
            fullWidth
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="How do you want your AIs to perform this mission? Help them by providing guidance on how to accomplish the mission"
            sx={{
              flex: 1,
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: 'rgba(255,255,255,0.9)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          
          <Button
            variant="contained"
            onClick={handleStartMission}
            disabled={isStarting || mission.status === 'locked'}
            fullWidth
            sx={{
              py: 1.5,
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' },
              fontSize: '1.1rem',
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
