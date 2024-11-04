import { useState, useEffect } from 'react';

export function useInfiniteScroll<T>(
  endpoint: string,
  pageSize: number = 20
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch(`${endpoint}?page=${page}&pageSize=${pageSize}`);
      const newData = await response.json();
      
      if (newData.length < pageSize) {
        setHasMore(false);
      }
      
      setData(prev => [...prev, ...newData]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return { data, loading, hasMore, loadMore };
}
