import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setAuth({
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          loading: false,
        });
      } else {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({
      isAuthenticated: true,
      user,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
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
