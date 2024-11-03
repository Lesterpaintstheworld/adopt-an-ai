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
