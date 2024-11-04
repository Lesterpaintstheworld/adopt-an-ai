import React, { useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function GPUsPage() {
  useEffect(() => {
    console.log('GPUsPage mounted');
  }, []);

  console.log('GPUsPage rendering');

  return (
    <Box sx={{ p: 4 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mb: 4,
          border: '2px solid #ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.08)',
          maxWidth: '800px',
          margin: '0 auto 2rem auto',
          position: 'relative',
          zIndex: 1000
        }}
      >
        <Typography variant="h6" component="h2" sx={{ color: '#ff9800', mb: 2 }}>
          Bienvenue dans la section GPUs
        </Typography>
        <Typography component="p" sx={{ mb: 2, color: 'text.primary' }}>
          Cette section vous permet de gérer vos ressources de calcul GPU pour l'entraînement de vos IAs.
          Vous pourrez y:
        </Typography>
        <ul style={{ color: 'rgba(255, 255, 255, 0.87)', marginLeft: '1.5rem' }}>
          <li>Voir vos GPUs disponibles</li>
          <li>Gérer l'allocation des ressources</li>
          <li>Suivre l'utilisation en temps réel</li>
          <li>Optimiser les performances de calcul</li>
        </ul>
      </Paper>

      <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
        GPUs
      </Typography>
    </Box>
  );
}
