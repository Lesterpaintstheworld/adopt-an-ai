import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { getPerkIconUrl } from '../utils/iconUtils';

const darkTheme = {
  ...atomOneDark,
  'hljs': {
    ...atomOneDark.hljs,
    background: '#1a1b2e',
    color: '#e4e4e7',
  }
};
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

  // Extract story from data if it exists
  const story = data?.story || '';
  // Create a copy of data without the story for YAML display
  const yamlData = { ...data };
  delete yamlData?.story;

  // Get the perk icon URL
  const getIconUrl = (data: any) => {
    if (!data?.capability_id || !data?.name) return null;
    
    // Convert name to filename-safe format
    const safeName = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `/website/icons/${safeName}-${data.capability_id}.png`;
  };

  const iconUrl = getIconUrl(data);

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
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#1a1b2e',
          color: '#fff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
      <DialogContent 
        dividers
        sx={{
          bgcolor: '#0f1021',
          borderTop: 'none',
          borderBottom: 'none',
          p: 0,
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Perk Icon Section */}
          {iconUrl && (
            <Box 
              sx={{ 
                mb: 4,
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
              }}
            >
              <img
                src={iconUrl}
                alt={title}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              />
            </Box>
          )}

          {/* Story Section */}
          {story && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#fff',
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  whiteSpace: 'pre-wrap',
                  fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
                  marginBottom: 4,
                  padding: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {story}
              </Typography>
            </Box>
          )}

          {/* YAML Section */}
          <SyntaxHighlighter
            language="yaml"
            style={darkTheme}
            customStyle={{
              margin: 0,
              borderRadius: '8px',
              fontSize: '15px',
              backgroundColor: '#1a1b2e',
              fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
              lineHeight: '1.6',
              padding: '20px',
            }}
            showLineNumbers={false}
          >
            {parseYaml(yamlData)}
          </SyntaxHighlighter>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default YamlModal;
