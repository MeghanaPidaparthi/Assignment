import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
      light: '#3498DB',
      dark: '#1A252F',
    },
    secondary: {
      main: '#E74C3C',
      light: '#F39C12',
      dark: '#C0392B',
    },
    background: {
      default: '#ECF0F1',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

export type Theme = typeof theme; 