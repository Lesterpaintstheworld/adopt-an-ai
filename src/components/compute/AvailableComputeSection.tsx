import { Box, Grid } from '@mui/material';
import { useRef, useEffect } from 'react';
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

  const lastCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastCardRef.current) {
      observer.observe(lastCardRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <Grid container spacing={3}>
      {gpus.map((gpu, index) => (
        <Grid 
          item 
          xs={12} sm={6} md={4} lg={3} 
          key={gpu.id}
          ref={index === gpus.length - 1 ? lastCardRef : null}
        >
          <GPUCard gpu={gpu} owned={false} />
        </Grid>
      ))}
    </Grid>
  );
}
