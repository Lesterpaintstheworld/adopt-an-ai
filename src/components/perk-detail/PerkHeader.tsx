import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import IconLoader from '../IconLoader';
import { Perk } from '../../types/tech';
import { COLORS } from '../../theme/colors';

interface PerkHeaderProps {
  perk: Perk;
  onImageClick: () => void;
}

const PerkHeader: React.FC<PerkHeaderProps> = ({ perk, onImageClick }) => {
  const getTagColor = (tag: string) => {
    const tagType = tag.split(' ')[1];
    switch (tagType) {
      case 'CREATIVE':
        return { backgroundColor: '#d32f2f', color: '#ffffff' };
      case 'TECHNICAL':
        return { backgroundColor: '#1976d2', color: '#ffffff' };
      case 'SOCIAL':
        return { backgroundColor: '#388e3c', color: '#ffffff' };
      case 'INTEGRATION':
        return { backgroundColor: '#7b1fa2', color: '#ffffff' };
      case 'COGNITIVE':
        return { backgroundColor: '#f57c00', color: '#ffffff' };
      case 'OPERATIONAL':
        return { backgroundColor: '#0288d1', color: '#ffffff' };
      default:
        return { backgroundColor: '#757575', color: '#ffffff' };
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <IconLoader
        perk={perk}
        onClick={onImageClick}
        sx={{ 
          width: {
            xs: 80,
            sm: 160
          },
          height: {
            xs: 80,
            sm: 160
          },
          cursor: 'pointer',
          borderRadius: 1,
          '&:hover': {
            opacity: 0.8,
          }
        }}
      />
      <Box>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '2.125rem'
            },
            color: COLORS.text.primary
          }}
        >
          {perk.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={perk.tag} 
            sx={{ 
              ...getTagColor(perk.tag),
              minWidth: '120px'
            }} 
          />
          <Chip 
            label={`ID: ${perk.capability_id}`}
            sx={{ 
              bgcolor: '#FFA500',
              color: '#000000',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PerkHeader;
import { FC } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { COLORS } from '../../theme/colors';
import IconLoader from '../IconLoader';
import { Perk } from '../../types/tech';
import { getTagIcon, getTagColor } from '../../utils/tagStyles';

interface PerkHeaderProps {
  perk: Perk;
  onImageClick?: () => void;
}

export const PerkHeader: FC<PerkHeaderProps> = ({ perk, onImageClick }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      mb: 2
    }}>
      <Box
        sx={{
          width: 120,
          height: 120,
          flexShrink: 0,
          overflow: 'hidden',
          cursor: onImageClick ? 'pointer' : 'default',
          borderRadius: 2,
        }}
      >
        <IconLoader
          perk={perk}
          onClick={onImageClick}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: COLORS.text.primary,
          fontWeight: 500
        }}>
          {perk.name}
        </Typography>

        <Chip
          icon={getTagIcon(perk.tag)}
          label={perk.tag.split(' ')[1]}
          size="medium"
          variant="outlined"
          sx={{
            ...getTagColor(perk.tag),
            '& .MuiChip-icon': {
              color: '#ffffff',
              marginLeft: '8px'
            },
            borderRadius: '16px',
            fontWeight: 500,
            height: '32px',
            minWidth: '140px',
            paddingLeft: '12px',
            paddingRight: '12px',
            fontSize: '0.95rem'
          }}
        />
      </Box>
    </Box>
  );
};

export default PerkHeader;
