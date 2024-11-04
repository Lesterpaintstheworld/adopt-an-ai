import { Paper, Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface SystemPromptProps {
  prompt: string;
  onChange?: (prompt: string) => void;
  readOnly?: boolean;
}

export default function SystemPrompt({ prompt, onChange, readOnly = false }: SystemPromptProps) {
  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        System Prompt
      </Typography>
      <TextField
        multiline
        fullWidth
        rows={20}
        value={prompt}
        onChange={(e) => onChange?.(e.target.value)}
        variant="outlined"
        InputProps={{
          readOnly,
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }
        }}
      />
    </StyledPaper>
  );
}
