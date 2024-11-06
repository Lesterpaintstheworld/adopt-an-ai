import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const darkTheme = {
  ...atomOneDark,
  'hljs': {
    ...atomOneDark.hljs,
    background: '#1a1b2e',
    color: '#e4e4e7',
  }
};
import { parseYaml } from '../../utils/yamlFormatter';
import { getPerkIconUrl } from '../../utils/iconUtils';
import { getPerkIllustrationUrl } from '../../utils/iconUtils';
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
  const [iconUrl, setIconUrl] = useState<string>('');

  // Update icon URL when data changes
  useEffect(() => {
    if (data) {
      setIconUrl(getPerkIconUrl(data));
    } else {
      setIconUrl('');
    }
  }, [data]);

  // Extract story from data if it exists
  const story = data?.story || '';
  // Create a copy of data without the story for YAML display
  const yamlData = { ...data };
  delete yamlData?.story;


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
          {iconUrl !== '' && (
            <Box 
              sx={{ 
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
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
                  maxWidth: '200px',
                  height: 'auto',
                  maxHeight: '200px',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 600,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {title}
              </Typography>
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

          {/* Illustration Section */}
          {data?.capability_id && (
            <Box sx={{ mb: 4 }}>
              <img
                src={getPerkIllustrationUrl(data)}
                alt={`Illustration for ${title}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onError={(e) => {
                  // Hide the image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
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
