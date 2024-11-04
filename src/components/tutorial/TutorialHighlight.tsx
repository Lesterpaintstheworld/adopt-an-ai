import { Box, Paper, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface TutorialStep {
  title: string;
  content: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to raise-an.ai",
    content: "This platform will help you develop and nurture your own AI assistant through guided missions and resource management."
  },
  {
    title: "Resource Management",
    content: "Here you can manage your compute resources. Allocate GPUs wisely to optimize your AI's training and development."
  },
  {
    title: "Training Progress",
    content: "Monitor your AI's progress through various capabilities and unlock new features as you advance."
  }
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
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: '#ff9800',
          transition: 'width 0.3s ease-in-out',
        }
      }}
    >
      <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
        {tutorialSteps[currentStep]?.title}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {tutorialSteps[currentStep]?.content}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Step {currentStep + 1} of {tutorialSteps.length}
          </Typography>
          <Box sx={{ 
            width: '200px', 
            height: '4px', 
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            borderRadius: '2px',
          }}>
            <Box sx={{ 
              width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
              height: '100%',
              backgroundColor: '#ff9800',
              transition: 'width 0.3s ease-in-out',
              borderRadius: '2px',
            }} />
          </Box>
        </Box>
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
