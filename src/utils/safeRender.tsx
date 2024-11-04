import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
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

    // Handle objects
    if (typeof content === 'object') {
      // Special case for objects with description and requirements
      if ('description' in content && 'requirements' in content) {
        return (
          <Box>
            <Typography>{String(content.description)}</Typography>
            <Typography sx={{ mt: 1 }}>
              Requirements: {Array.isArray(content.requirements) ? 
                content.requirements.join(', ') : 
                String(content.requirements)}
            </Typography>
          </Box>
        );
      }

      // Try to convert object to string using formatValue
      try {
        const formattedText = formatValue(content);
        
        // If result is still an object, stringify it
        if (typeof formattedText === 'object') {
          return JSON.stringify(formattedText);
        }

        // Handle multiline strings
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
      } catch {
        // Fallback to JSON stringify if formatValue fails
        return JSON.stringify(content);
      }
    }

    // Convert any other types to string
    return String(content);
  } catch (error) {
    console.error('Error in safeRender:', error, 'Content:', content);
    return '[Error rendering content]';
  }
};
