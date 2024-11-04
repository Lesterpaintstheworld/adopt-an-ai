import { useGoogleLogin } from '@react-oauth/google';
import { Button, CircularProgress, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export const GoogleLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleGoogleResponse = async (tokenResponse: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify token response
      if (!tokenResponse?.access_token) {
        throw new Error('Invalid token response');
      }

      console.log('Got Google token:', tokenResponse.access_token.substring(0, 10) + '...');

      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 
          Authorization: `Bearer ${tokenResponse.access_token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!userInfoResponse.ok) {
        const errorText = await userInfoResponse.text();
        console.error('User info error:', errorText);
        throw new Error(`Failed to get user info: ${userInfoResponse.status}`);
      }

      const user = await userInfoResponse.json();
      console.log('Got user info:', { ...user, sub: user.sub?.substring(0, 5) + '...' });

      // Validate user data
      if (!user.sub || !user.email) {
        throw new Error('Invalid user data');
      }

      // Add debug logging
      console.log('Sending auth request with data:', {
        googleToken: tokenResponse.access_token.substring(0, 10) + '...',
        userData: {
          google_id: user.sub,
          email: user.email,
          name: user.name || user.email.split('@')[0],
          picture: user.picture,
        }
      });

      const requestBody = {
        googleToken: tokenResponse.access_token,
        userData: {
          google_id: user.sub,
          email: user.email,
          name: user.name || user.email.split('@')[0],
          picture: user.picture
        }
      };

      console.log('Sending request body:', JSON.stringify(requestBody, null, 2));

      const authResponse = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.log('Full auth error response:', {
          status: authResponse.status,
          statusText: authResponse.statusText,
          body: errorText
        });
        throw new Error(`Authentication failed: ${authResponse.status} - ${errorText}`);
      }

      // Parse the successful response
      const data = await authResponse.json();
      if (data) {
        login(data.user, data.token);
      } else {
        throw new Error('Empty response from auth server');
      }
      
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
    prompt: 'select_account',
    cookiePolicy: 'single_host_origin',
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
