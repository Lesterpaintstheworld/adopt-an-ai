import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  console.log('MainLayout rendering...');
  return (
    <Box>
      <h1>Test Layout</h1>
      <Outlet />
    </Box>
  );
};
