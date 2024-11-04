import { Box, Typography } from '@mui/material';
import { formatValue } from './formatters';

export const safeRender = (content: any): React.ReactNode => {
  try {
    // Base cases
    if (content === null || content === undefined) {
      return '';
    }

    // Simple types
    if (typeof content === 'string') return content;
    if (typeof content === 'number') return content.toString();
    if (typeof content === 'boolean') return content.toString();

    // Handle objects with description and requirements
    if (typeof content === 'object' && content !== null) {
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
    }

    // Convert to formatted text
    const formattedText = formatValue(content);

    // If text contains newlines, preserve formatting
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
  } catch (error) {
    console.error('Error in safeRender:', error, 'Content:', content);
    return <pre>[Error rendering content]</pre>;
  }
};
import { ReactNode } from 'react';

/**
 * Safely renders content that might be a string, number, or React node
 * Handles undefined, null, and objects by converting them to appropriate string representations
 */
export const safeRender = (content: any): ReactNode => {
  if (content === null || content === undefined) {
    return '';
  }

  if (typeof content === 'string' || typeof content === 'number') {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <span key={index}>{safeRender(item)}</span>
    ));
  }

  if (typeof content === 'object') {
    // If it's a React element, return it directly
    if (React.isValidElement(content)) {
      return content;
    }
    // Otherwise convert object to string
    return JSON.stringify(content);
  }

  // Convert any other types to string
  return String(content);
};
