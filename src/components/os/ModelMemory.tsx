import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import StorageIcon from '@mui/icons-material/Storage';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface ModelMemoryProps {
  vectorStore: {
    name: string;
    size: number;
    lastUpdated: string;
  };
}

export default function ModelMemory({ vectorStore }: ModelMemoryProps) {
  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Memory
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorageIcon />
        <Box>
          <Typography variant="subtitle1">{vectorStore.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Size: {vectorStore.size} vectors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {vectorStore.lastUpdated}
          </Typography>
        </Box>
      </Box>
    </StyledPaper>
  );
}
