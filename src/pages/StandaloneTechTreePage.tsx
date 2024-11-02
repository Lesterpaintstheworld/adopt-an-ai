import { Box } from '@mui/material';
import TechTreePage from './TechTreePage';

const StandaloneTechTreePage = () => {
  return (
    <Box sx={{ 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: 'background.default'
    }}>
      <TechTreePage standalone={true} />
    </Box>
  );
};

export default StandaloneTechTreePage;
