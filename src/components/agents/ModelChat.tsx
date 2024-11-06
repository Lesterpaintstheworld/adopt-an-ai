import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

export default function AgentChat() {
  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      <Box sx={{ 
        height: 'calc(100% - 40px)', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'text.secondary'
      }}>
        <Typography>
          Chat interface coming soon...
        </Typography>
      </Box>
    </StyledPaper>
  );
}
