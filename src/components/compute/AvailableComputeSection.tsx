import { Box, Grid } from '@mui/material';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import GPUCard from './GPUCard';

interface AvailableGPU {
  id: string;
  name: string;
  memory: number;
  performance: string;
  price: {
    hourly: number;
    monthly: number;
  };
  availability: 'available' | 'limited' | 'unavailable';
}

export default function AvailableComputeSection() {
  const { data: gpus, loading, hasMore, loadMore } = useInfiniteScroll<AvailableGPU>(
    '/api/available-gpus',
    20
  );

  return (
    <Grid container spacing={3}>
      {gpus.map((gpu) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={gpu.id}>
          <GPUCard gpu={gpu} owned={false} />
        </Grid>
      ))}
    </Grid>
  );
}
