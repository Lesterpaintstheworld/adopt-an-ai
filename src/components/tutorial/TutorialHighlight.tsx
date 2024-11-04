import { Box, Paper, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { pageTutorials } from '../../data/tutorialSteps';
import type { PageKey } from '../../data/tutorialSteps';

/**
 * TutorialHighlight Component
 * Displays a tutorial box for specific pages with dismissable content
 * @param {Object} props - Component props
 * @param {PageKey} props.pageKey - The key identifying the current page
 * @returns {JSX.Element | null} The tutorial highlight component or null if already dismissed
 */
export const TutorialHighlight = ({ pageKey }: { pageKey: PageKey }) => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorial = pageTutorials[pageKey];

  useEffect(() => {
    const checkVisibility = () => {
      const localTutorialStatus = localStorage.getItem('tutorial_status');
      if (localTutorialStatus) {
        const { dismissedPages = [] } = JSON.parse(localTutorialStatus);
        if (dismissedPages.includes(pageKey)) {
          return false;
        }
      } else if (isAuthenticated && user?.tutorialProgress?.dismissedPages?.includes(pageKey)) {
        return false;
      }
      return true;
    };

    setVisible(checkVisibility());
  }, [pageKey, user, isAuthenticated]);

  if (!visible || !tutorial) {
    console.log('TutorialHighlight not showing because:', {
      visible,
      hasTutorial: !!tutorial
    });
    return null;
  }

  const handleNext = async () => {
    if (isAuthenticated && user?.id) {
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
        if (data.success) {
          setVisible(false);
        }
      } catch (error) {
        console.error('Failed to update tutorial status:', error);
      }
    } else {
      // Handle non-authenticated user case
      const existingStatus = localStorage.getItem('tutorial_status');
      const currentStatus = existingStatus ? JSON.parse(existingStatus) : { dismissedPages: [] };
      
      localStorage.setItem('tutorial_status', JSON.stringify({
        ...currentStatus,
        dismissedPages: [...(currentStatus.dismissedPages || []), pageKey],
        lastUpdated: new Date().toISOString()
      }));
      
      setVisible(false);
    }
  };

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
          aria-label="Mark as read"
          sx={{ 
            backgroundColor: '#ff9800',
            '&:hover': {
              backgroundColor: '#f57c00',
            }
          }}
        >
          I understand
        </Button>
      </Box>
    </Paper>
  );
};
