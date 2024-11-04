import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

interface ModelCardProps {
  model: any; // Type will depend on the section
  type: 'training' | 'owned' | 'available';
}

export default function ModelCard({ model, type }: ModelCardProps) {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {model.name}
        </Typography>

        {type === 'training' && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={model.progress} 
                sx={{ mt: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                ETA: {model.eta}
              </Typography>
            </Box>
            <Chip 
              label={model.status}
              size="small"
              color={model.status === 'training' ? "success" : "default"}
            />
          </>
        )}

        {type === 'owned' && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Last used: {model.lastUsed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Performance: {model.performance}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {model.size}
              </Typography>
            </Box>
            <Button variant="contained" fullWidth>
              Use Model
            </Button>
          </>
        )}

        {type === 'available' && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Size: {model.size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Downloads: {model.downloads}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rating: {model.rating}/5
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              fullWidth
              color={model.price.amount === 0 ? "success" : "primary"}
            >
              {model.price.amount === 0 ? 'Download' : `Buy - $${model.price.amount}`}
            </Button>
          </>
        )}
      </CardContent>
    </StyledCard>
  );
}
