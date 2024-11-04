import { Box, Grid } from '@mui/material';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ModelCard from './ModelCard';

interface AvailableModel {
  id: string;
  name: string;
  type: string;
  size: string;
  downloads: number;
  rating: number;
  price: {
    amount: number;
    currency: string;
  };
}

export default function ModelsDatasetSection() {
  const [models, setModels] = useState<AvailableModel[]>([
    {
      id: 'm1',
      name: 'GPT-2 Small',
      type: 'Language Model',
      size: '1.5GB',
      downloads: 10000,
      rating: 4.5,
      price: {
        amount: 0,
        currency: 'USD'
      }
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const lastCardRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add more mock data
    const newModels: AvailableModel[] = [
      {
        id: `m${models.length + 1}`,
        name: 'BERT-Base',
        type: 'Language Model',
        size: '2.1GB',
        downloads: 8500,
        rating: 4.2,
        price: {
          amount: 0,
          currency: 'USD'
        }
      }
    ];

    setModels(prev => [...prev, ...newModels]);
    setPage(prev => prev + 1);
    
    if (page >= 3) {
      setHasMore(false);
    }
    
    setLoading(false);
  };

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
  }, [hasMore, loading]);

  return (
    <Grid container spacing={3}>
      {models.map((model, index) => (
        <Grid 
          item 
          xs={12} sm={6} md={4} lg={3} 
          key={model.id}
          ref={index === models.length - 1 ? lastCardRef : null}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index % 4 * 0.1,
              ease: "easeOut"
            }}
          >
            <ModelCard model={model} type="available" />
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
