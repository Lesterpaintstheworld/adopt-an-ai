import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00A3FF',
      light: '#33B4FF',
      dark: '#0072B2',
    },
    secondary: {
      main: '#FF5722',
      light: '#FF784E',
      dark: '#B23C17',
    },
    background: {
      default: '#0A1929',
      paper: '#132F4C',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Arial", sans-serif',
    h1: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.8125rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.8125rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '4px 12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '0.8125rem',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '3px 6px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#132F4C',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  spacing: (factor: number) => `${0.625 * factor}rem`,
  shape: {
    borderRadius: 8,
  },
});
