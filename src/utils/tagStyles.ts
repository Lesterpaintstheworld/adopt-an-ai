import { SxProps } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { ReactElement } from 'react';

export const getTagColor = (tag: string): SxProps => {
  const tagType = tag.split(' ')[1];
  switch (tagType) {
    case 'CREATIVE':
      return { backgroundColor: '#d32f2f', color: '#ffffff', minWidth: '120px' };
    case 'TECHNICAL':
      return { backgroundColor: '#1976d2', color: '#ffffff', minWidth: '120px' };
    case 'SOCIAL':
      return { backgroundColor: '#388e3c', color: '#ffffff', minWidth: '120px' };
    case 'INTEGRATION':
      return { backgroundColor: '#7b1fa2', color: '#ffffff', minWidth: '120px' };
    case 'COGNITIVE':
      return { backgroundColor: '#f57c00', color: '#ffffff', minWidth: '120px' };
    case 'OPERATIONAL':
      return { backgroundColor: '#0288d1', color: '#ffffff', minWidth: '120px' };
    default:
      return { backgroundColor: '#757575', color: '#ffffff', minWidth: '120px' };
  }
};

export const getTagIcon = (tag: string): ReactElement => {
  const iconType = tag.split(' ')[1];
  switch (iconType) {
    case 'CREATIVE':
      return React.createElement(BrushIcon);
    case 'TECHNICAL':
      return React.createElement(BuildIcon);
    case 'SOCIAL':
      return React.createElement(PeopleIcon);
    case 'INTEGRATION':
      return React.createElement(NetworkCheckIcon);
    case 'COGNITIVE':
      return React.createElement(PsychologyIcon);
    case 'OPERATIONAL':
      return React.createElement(SettingsIcon);
    default:
      return React.createElement(CodeIcon);
  }
};
