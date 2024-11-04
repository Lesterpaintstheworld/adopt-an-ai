import { Paper, Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiTextField-root': {
    marginTop: theme.spacing(2),
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    }
  }
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
