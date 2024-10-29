import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

export const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      setVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      initial={{ opacity: 0 }}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{ borderRadius: '50%', minWidth: 0, width: 48, height: 48 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </Button>
    </motion.div>
  );
};
