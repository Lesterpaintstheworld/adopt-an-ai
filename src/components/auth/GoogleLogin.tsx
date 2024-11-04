import { useGoogleLogin } from '@react-oauth/google';
import { Button, CircularProgress, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export const GoogleLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleResponse = async (tokenResponse: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify token response
      if (!tokenResponse?.access_token) {
        throw new Error('Invalid token response');
      }

      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 
          Authorization: `Bearer ${tokenResponse.access_token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!userInfo.ok) {
        throw new Error('Failed to get user info');
      }

      const user = await userInfo.json();

      // Validate user data
      if (!user.sub || !user.email) {
        throw new Error('Invalid user data');
      }

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
            name: user.name || user.email.split('@')[0],
            picture: user.picture,
          }
        }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const { user: userData, token } = await authResponse.json();
      login(userData, token);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: () => setError('Google login failed'),
    flow: 'implicit',
    scope: 'email profile',
    ux_mode: 'popup',
  });

  return (
    <>
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
      {error && (
        <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </>
  );
};
