import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './utils/theme';
import { MainLayout } from './components/layout/MainLayout';
import StandaloneTechTreePage from './pages/StandaloneTechTreePage';
import HomePage from './pages/HomePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import EnterpriseContactPage from './pages/EnterpriseContactPage';
import TechTreePage from './pages/TechTreePage';
import MissionsPage from './pages/MissionsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdoptPage from './pages/AdoptPage';
import MyAIsPage from './pages/MyAIsPage';
import PricingPage from './pages/PricingPage';

console.log('App component initializing...');

function App() {
  console.log('App rendering...');
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/tech-tree-standalone" element={<StandaloneTechTreePage />} />
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/enterprise" element={<EnterpriseContactPage />} />
            <Route path="/tech-tree" element={<TechTreePage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/adopt" element={<AdoptPage />} />
            <Route path="/my-ais" element={<MyAIsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="*" element={
              <div style={{ padding: '20px' }}>
                <h1>404 - Page Not Found</h1>
                <p>Current path: {window.location.pathname}</p>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
