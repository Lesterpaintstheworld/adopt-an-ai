export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
