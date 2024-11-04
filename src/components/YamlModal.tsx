import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { parseYaml } from '../utils/yamlFormatter';
import CloseIcon from '@mui/icons-material/Close';

SyntaxHighlighter.registerLanguage('yaml', yaml);

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
          <SyntaxHighlighter
            language="yaml"
            style={theme.palette.mode === 'dark' ? atomOneDark : atomOneLight}
            customStyle={{
              margin: 0,
              borderRadius: '4px',
              fontSize: '14px',
            }}
            showLineNumbers
          >
            {parseYaml(data)}
          </SyntaxHighlighter>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default YamlModal;
