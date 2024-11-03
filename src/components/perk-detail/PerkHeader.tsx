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
