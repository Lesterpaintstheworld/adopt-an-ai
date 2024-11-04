import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography 
} from '@mui/material';
import { useTutorial } from '../../contexts/TutorialContext';

export const TutorialPopup = () => {
  const { currentStep, nextStep, skipTutorial } = useTutorial();

  const tutorialSteps = [
    {
      title: "Bienvenue sur raise-an.ai !",
      content: "Nous allons vous guider à travers les principales fonctionnalités de la plateforme.",
      isFirst: true
    },
    {
      title: "Les GPUs",
      content: "Cette section vous permet de gérer vos ressources de calcul pour l'entraînement de vos AIs.",
    }
  ];

  const currentStepData = tutorialSteps[currentStep - 1];

  if (!currentStepData || currentStep === 0) return null;

  return (
    <Dialog 
      open={true}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{currentStepData.title}</DialogTitle>
      <DialogContent>
        <Typography>{currentStepData.content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={skipTutorial} color="inherit">
          Passer le tutoriel
        </Button>
        <Button 
          onClick={nextStep} 
          variant="contained"
        >
          {currentStep === tutorialSteps.length ? "Terminer" : "Suivant"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
