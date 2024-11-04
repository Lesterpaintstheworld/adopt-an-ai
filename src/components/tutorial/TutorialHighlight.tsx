import { Box, Paper, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { pageTutorials, PageKey } from '../../data/tutorialSteps';

/**
 * TutorialHighlight Component
 * Displays a tutorial box for specific pages with dismissable content
 * @param {Object} props - Component props
 * @param {PageKey} props.pageKey - The key identifying the current page
 * @returns {JSX.Element | null} The tutorial highlight component or null if already dismissed
 */
export const TutorialHighlight = ({ pageKey }: { pageKey: PageKey }) => {
  const { user, updateUser } = useAuth();
  const [visible, setVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorial = pageTutorials[pageKey];

  const handleNext = async () => {
    if (!user?.id) {
      console.error('No user ID available');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/tutorial-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          isComplete: false,
          progress: {
            ...user.tutorialProgress,
            dismissedPages: [...(user.tutorialProgress?.dismissedPages || []), pageKey]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      updateUser({
        tutorialProgress: data.data.tutorial_progress || {
          ...user.tutorialProgress,
          dismissedPages: [...(user.tutorialProgress?.dismissedPages || []), pageKey]
        }
      });
      setVisible(false);
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
      role="complementary"
      aria-label="Tutorial guidance"
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
      <Typography variant="h6" component="h2" sx={{ color: '#ff9800', mb: 1 }}>
        {tutorial.title}
      </Typography>
      <Typography component="p" sx={{ mb: 2 }}>
        {tutorial.content}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          onClick={handleNext}
          variant="contained"
          aria-label="Marquer comme lu"
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
