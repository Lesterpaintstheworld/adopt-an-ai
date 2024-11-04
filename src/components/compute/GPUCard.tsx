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

interface BaseGPU {
  id: string;
  name: string;
  memory: number;
}

interface OwnedGPU extends BaseGPU {
  usage: number;
  temperature: number;
  power: number;
  status: 'active' | 'idle' | 'offline';
}

interface AvailableGPU extends BaseGPU {
  performance: string;
  price: {
    hourly: number;
    monthly: number;
  };
  availability: 'available' | 'limited' | 'unavailable';
}

interface GPUCardProps {
  gpu: OwnedGPU | AvailableGPU;
  owned: boolean;
}

export default function GPUCard({ gpu, owned }: GPUCardProps) {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {gpu.name}
        </Typography>
        
        {owned ? (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Usage
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={gpu.usage} 
                sx={{ mt: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={`${gpu.temperature}°C`}
                size="small"
                color={gpu.temperature > 80 ? "error" : "default"}
              />
              <Chip 
                label={`${gpu.power}W`}
                size="small"
              />
              <Chip 
                label={gpu.status}
                size="small"
                color={gpu.status === 'active' ? "success" : "default"}
              />
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Performance: {gpu.performance}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Memory: {gpu.memory}GB
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={`$${gpu.price.hourly}/hour`}
                size="small"
                color="primary"
              />
              <Chip 
                label={gpu.availability}
                size="small"
                color={gpu.availability === 'available' ? "success" : "warning"}
              />
            </Box>
            <Button 
              variant="contained" 
              fullWidth
              disabled={gpu.availability === 'unavailable'}
            >
              Rent GPU
            </Button>
          </>
        )}
      </CardContent>
    </StyledCard>
  );
}
