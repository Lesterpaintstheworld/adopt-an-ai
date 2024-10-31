import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './utils/theme';
import { MainLayout } from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import EnterpriseContactPage from './pages/EnterpriseContactPage';
import { TechTreePage } from './pages/TechTreePage';
import MissionsPage from './pages/MissionsPage';

console.log('App component initializing...');

function App() {
  console.log('App rendering...');
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/enterprise" element={<EnterpriseContactPage />} />
            <Route path="/tech-tree" element={<TechTreePage />} />
            <Route path="/missions" element={<MissionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
