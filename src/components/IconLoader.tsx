import { useState, useEffect, FC } from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import { getPerkIconUrl } from '../utils/iconUtils';

interface IconLoaderProps {
  perk: { capability_id?: string; name?: string };
  onClick?: () => void;
  sx?: SxProps;
}

const IconLoader: FC<IconLoaderProps> = ({ perk, onClick, sx }) => {
  const [iconUrl, setIconUrl] = useState('/default-perk-icon.png');

  useEffect(() => {
    setIconUrl(getPerkIconUrl(perk));
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

export default IconLoader;
