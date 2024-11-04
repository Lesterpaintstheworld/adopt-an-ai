import { Box, Paper, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { pageTutorials, PageKey } from '../../data/tutorialSteps';

export const TutorialHighlight = ({ pageKey }: { pageKey: PageKey }) => {
  const { user, updateUser } = useAuth();
  const [visible, setVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorial = pageTutorials[pageKey];

  const handleNext = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user?.id}/tutorial-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          isComplete: false,
          progress: {
            ...user?.tutorialProgress,
            dismissedPages: [...(user?.tutorialProgress?.dismissedPages || []), pageKey]
          }
        })
      });

      if (response.ok) {
        updateUser({
          tutorialProgress: {
            ...user?.tutorialProgress,
            dismissedPages: [...(user?.tutorialProgress?.dismissedPages || []), pageKey]
          }
        });
        setVisible(false);
      }
    } catch (error) {
      console.error('Failed to update tutorial status:', error);
    }
  };

  useEffect(() => {
    if (user?.tutorialProgress?.dismissedPages?.includes(pageKey)) {
      setVisible(false);
    }
  }, [user, pageKey]);

  if (!visible || !tutorial) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'relative',
        p: 4,
        mb: 4,
        border: '2px solid #ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.08)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme => theme.shadows[6],
        }
      }}
    >
      <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
        {tutorial.title}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {tutorial.content}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          onClick={handleNext}
          variant="contained"
          sx={{ 
            backgroundColor: '#ff9800',
            '&:hover': {
              backgroundColor: '#f57c00',
            }
          }}
        >
          J'ai compris
        </Button>
      </Box>
    </Paper>
  );
};
