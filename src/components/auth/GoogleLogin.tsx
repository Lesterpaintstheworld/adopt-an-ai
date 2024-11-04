import { useGoogleLogin } from '@react-oauth/google';
import { Button, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export const GoogleLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleResponse = async (tokenResponse: any) => {
    try {
      setLoading(true);
      
      // Obtenir les informations de l'utilisateur depuis Google
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      
      if (!userInfo.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const user = await userInfo.json();

      // Authentifier avec votre backend
      const authResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: tokenResponse.access_token,
          userData: {
            googleId: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture,
          }
        }),
      });

      if (!authResponse.ok) {
        throw new Error('Authentication failed');
      }

      const { user: userData, token } = await authResponse.json();
      login(userData, token);
      
    } catch (error) {
      console.error('Error during Google login:', error);
      // Gérer l'erreur (afficher un message, etc.)
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: () => console.error('Login Failed'),
  });

  return (
    <Button
      variant="contained"
      startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
      onClick={() => !loading && googleLogin()}
      disabled={loading}
      fullWidth
      sx={{
        backgroundColor: '#fff',
        color: '#757575',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
        mt: 2,
        mb: 2,
      }}
    >
      {loading ? 'Connecting...' : 'Continue with Google'}
    </Button>
  );
};
