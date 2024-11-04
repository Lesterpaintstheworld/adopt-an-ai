import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useTheme
} from '@mui/material';
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
            wordWrap: 'break-word'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default YamlModal;
