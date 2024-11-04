import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';

export const GoogleLogin = () => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Obtenir les informations de l'utilisateur
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        const user = await userInfo.json();
        
        // Créer l'objet utilisateur
        const userData = {
          id: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
          googleId: user.sub,
        };

        // Connecter l'utilisateur
        login(userData);
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    },
    onError: () => console.error('Login Failed'),
  });

  return (
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={() => googleLogin()}
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
      Continue with Google
    </Button>
  );
};
