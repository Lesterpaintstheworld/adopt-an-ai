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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [gpus, setGpus] = useState<AvailableGPU[]>([
    {
      id: 'a1',
      name: 'NVIDIA A100',
      memory: 80,
      performance: 'Ultra High',
      price: {
        hourly: 2.5,
        monthly: 1200
      },
      availability: 'available'
    },
    {
      id: 'a2',
      name: 'NVIDIA V100',
      memory: 32,
      performance: 'High',
      price: {
        hourly: 1.8,
        monthly: 800
      },
      availability: 'limited'
    },
    {
      id: 'a3',
      name: 'NVIDIA T4',
      memory: 16,
      performance: 'Medium',
      price: {
        hourly: 0.8,
        monthly: 350
      },
      availability: 'available'
    },
    {
      id: 'a4',
      name: 'NVIDIA A6000',
      memory: 48,
      performance: 'Very High',
      price: {
        hourly: 2.0,
        monthly: 900
      },
      availability: 'unavailable'
    }
  ]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add more mock data
    const newGpus: AvailableGPU[] = [
      {
        id: `a${gpus.length + 1}`,
        name: 'NVIDIA A40',
        memory: 48,
        performance: 'High',
        price: {
          hourly: 1.5,
          monthly: 650
        },
        availability: 'available'
      },
      {
        id: `a${gpus.length + 2}`,
        name: 'NVIDIA RTX 6000',
        memory: 24,
        performance: 'Medium',
        price: {
          hourly: 1.2,
          monthly: 500
        },
        availability: 'limited'
      }
    ];

    setGpus(prev => [...prev, ...newGpus]);
    setPage(prev => prev + 1);
    
    // Stop after 3 pages
    if (page >= 3) {
      setHasMore(false);
    }
    
    setLoading(false);
  };

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
