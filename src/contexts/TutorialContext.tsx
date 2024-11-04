import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface TutorialContextType {
  isTutorialComplete: boolean;
  currentStep: number;
  startTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const checkTutorialStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/tutorial-status`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          setIsTutorialComplete(data.isComplete);
        } catch (error) {
          console.error('Error checking tutorial status:', error);
        }
      } else {
        const localTutorialStatus = localStorage.getItem('tutorial_status');
        if (localTutorialStatus) {
          setIsTutorialComplete(JSON.parse(localTutorialStatus).isComplete);
        }
      }
    };
    
    checkTutorialStatus();
  }, [user, isAuthenticated]);

  const startTutorial = () => {
    setCurrentStep(1);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const skipTutorial = async () => {
    if (isAuthenticated && user) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/tutorial-status`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: 'include',
          body: JSON.stringify({ isComplete: true })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setIsTutorialComplete(true);
          setCurrentStep(0);
        }
      } catch (error) {
        console.error('Error updating tutorial status:', error);
      }
    } else {
      localStorage.setItem('tutorial_status', JSON.stringify({ 
        isComplete: true,
        lastUpdated: new Date().toISOString()
      }));
      setIsTutorialComplete(true);
      setCurrentStep(0);
    }
  };

  return (
    <TutorialContext.Provider 
      value={{ 
        isTutorialComplete, 
        currentStep, 
        startTutorial, 
        nextStep, 
        skipTutorial 
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
