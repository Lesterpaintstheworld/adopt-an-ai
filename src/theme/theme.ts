import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '6px 16px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontSize: '1rem',
        },
        body1: {
          fontSize: '0.875rem',
        },
        body2: {
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '4px 8px',
        },
      },
    },
  },
  spacing: (factor: number) => `${0.75 * factor}rem`,
});
