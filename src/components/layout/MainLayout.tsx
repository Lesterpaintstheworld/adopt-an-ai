import { Box } from '@mui/material';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
        © {new Date().getFullYear()} Your Company Name
      </Box>
    </Box>
  );
};
