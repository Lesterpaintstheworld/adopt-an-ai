import { Box, Paper, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface TutorialStep {
  title: string;
  content: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Bienvenue sur la page GPUs!",
    content: "Ici vous pourrez gérer vos ressources de calcul pour entraîner votre IA."
  },
  {
    title: "Gestion des GPUs",
    content: "Vous pouvez allouer et désallouer des GPUs selon vos besoins."
  },
];

export const TutorialHighlight = () => {
  const { user, updateUser } = useAuth();
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (user && !user.tutorialCompleted) {
      setVisible(true);
      setCurrentStep(user.tutorialProgress?.lastStep || 0);
    }
  }, [user]);

  const handleNext = async () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      await updateTutorialProgress(currentStep + 1);
    } else {
      await completeTutorial();
      setVisible(false);
    }
  };

  const updateTutorialProgress = async (step: number) => {
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
            lastStep: step,
            completedSteps: [...(user?.tutorialProgress?.completedSteps || []), step]
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        updateUser({
          tutorialProgress: data.data.tutorial_progress
        });
      }
    } catch (error) {
      console.error('Failed to update tutorial progress:', error);
    }
  };

  const completeTutorial = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user?.id}/tutorial-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          isComplete: true,
          progress: {
            lastStep: tutorialSteps.length - 1,
            completedSteps: Array.from({ length: tutorialSteps.length }, (_, i) => i)
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        updateUser({
          tutorialCompleted: true,
          tutorialProgress: data.data.tutorial_progress
        });
      }
    } catch (error) {
      console.error('Failed to complete tutorial:', error);
    }
  };

  if (!visible) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'relative',
        p: 3,
        mb: 4,
        border: '2px solid #ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.08)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: '#ff9800',
        }
      }}
    >
      <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
        {tutorialSteps[currentStep]?.title}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {tutorialSteps[currentStep]?.content}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Étape {currentStep + 1} sur {tutorialSteps.length}
        </Typography>
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
          {currentStep < tutorialSteps.length - 1 ? 'Suivant' : 'Terminer'}
        </Button>
      </Box>
    </Paper>
  );
};
