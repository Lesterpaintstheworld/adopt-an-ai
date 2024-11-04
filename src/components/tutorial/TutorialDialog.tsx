import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
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
  // Ajoutez d'autres étapes selon vos besoins
];

export const TutorialDialog = () => {
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (user && !user.tutorialCompleted) {
      setOpen(true);
      setCurrentStep(user.tutorialProgress?.lastStep || 0);
    }
  }, [user]);

  const handleNext = async () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      await updateTutorialProgress(currentStep + 1);
    } else {
      await completeTutorial();
      setOpen(false);
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

  return (
    <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
      <DialogTitle>
        {tutorialSteps[currentStep]?.title}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {tutorialSteps[currentStep]?.content}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleNext}
          variant="contained"
          color="primary"
        >
          {currentStep < tutorialSteps.length - 1 ? 'Suivant' : 'Terminer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
