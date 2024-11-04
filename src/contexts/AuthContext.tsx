import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: undefined
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Vérifier la validité du token
          const isValid = await validateToken(token);
          
          if (isValid) {
            setAuth({
              isAuthenticated: true,
              user: JSON.parse(storedUser),
              loading: false
            });
          } else {
            // Token invalide, déconnecter l'utilisateur
            handleLogout();
          }
        } else {
          setAuth(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setAuth({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Session verification failed'
        });
      }
    };

    checkAuth();
  }, []);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const login = (user: User, token: string) => {
    const userWithDefaultTutorial = {
      ...user,
      tutorialProgress: user.tutorialProgress || {
        lastStep: 0,
        completedSteps: [],
        dismissedPages: []
      }
    };
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userWithDefaultTutorial));
    setAuth({
      isAuthenticated: true,
      user: userWithDefaultTutorial,
      loading: false
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  const updateUser = (userData: Partial<User>) => {
    setAuth(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  const clearError = () => {
    setAuth(prev => ({ ...prev, error: undefined }));
  };

  return (
    <AuthContext.Provider value={{ 
      ...auth, 
      login, 
      logout: handleLogout, 
      updateUser,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
