export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
  createdAt?: string;
  lastLogin?: string;
  tutorialCompleted: boolean;
  tutorialProgress: {
    lastStep: number;
    completedSteps: number[];
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
