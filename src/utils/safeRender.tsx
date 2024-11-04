import React, { ReactNode } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { formatValue } from './formatters';

export const safeRender = (content: any): ReactNode => {
  try {
    // Base cases
    if (content === null || content === undefined) {
      return '';
    }

    // Simple types
    if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
      return String(content);
    }

    // Arrays
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <span key={index}>{safeRender(item)}</span>
      ));
    }

    // React elements
    if (React.isValidElement(content)) {
      return content;
    }

    // Handle objects with description and requirements
    if (typeof content === 'object') {
      if ('description' in content && 'requirements' in content) {
        const reqText = Array.isArray(content.requirements) ? 
          content.requirements.join(', ') : 
          String(content.requirements);
        return (
          <Box>
            <Typography>{String(content.description)}</Typography>
            <Typography sx={{ mt: 1 }}>
              Requirements: {reqText}
            </Typography>
          </Box>
        );
      }

      // If text contains newlines, preserve formatting
      const formattedText = formatValue(content);
      if (typeof formattedText === 'string' && formattedText.includes('\n')) {
        return (
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            margin: 0,
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }}>
            {formattedText}
          </pre>
        );
      }

      return formattedText;
    }

    // Convert any other types to string
    return String(content);
  } catch (error) {
    console.error('Error in safeRender:', error, 'Content:', content);
    return <pre>[Error rendering content]</pre>;
  }
};
