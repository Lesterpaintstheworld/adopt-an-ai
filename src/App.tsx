import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './utils/theme';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { EnterpriseContactPage } from './pages/EnterpriseContactPage';
import { TechTreePage } from './pages/TechTreePage';
function App() {
  console.log('App component rendering...');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ position: 'fixed', top: 0, left: 0, padding: '10px', background: '#fff', zIndex: 9999 }}>
        Loading...
      </div>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/tech-tree" element={<TechTreePage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/enterprise-contact" element={<EnterpriseContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
