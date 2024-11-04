import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useTheme,
  Typography
} from '@mui/material';
import { parseYaml } from '../utils/yamlFormatter';
import CloseIcon from '@mui/icons-material/Close';

interface YamlModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  data: any;
}

export const YamlModal: React.FC<YamlModalProps> = ({
  open,
  onClose,
  title = 'Details',
  data
}) => {
  const theme = useTheme();

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 1 }}>
          <pre style={{ 
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: '14px',
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            color: theme.palette.mode === 'dark' ? '#e6e6e6' : '#333'
          }}>
            {parseYaml(data)}
          </pre>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default YamlModal;
