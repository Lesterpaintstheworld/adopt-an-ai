import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AgentsPage from './pages/AgentsPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { TutorialProvider } from './contexts/TutorialContext';
import { theme } from './utils/theme';
import { MainLayout } from './components/layout/MainLayout';
import DAOsPage from './pages/DAOsPage';
import TeamsPage from './pages/TeamsPage';
import GPUsPage from './pages/GPUsPage';
import ModelsPage from './pages/ModelsPage';
import StandaloneTechTreePage from './pages/StandaloneTechTreePage';
import HomePage from './pages/HomePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import EnterpriseContactPage from './pages/EnterpriseContactPage';
import TechTreePage from './pages/TechTreePage';
import MissionsPage from './pages/MissionsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdoptPage from './pages/AdoptPage';
import PricingPage from './pages/PricingPage';

console.log('App component initializing...');

function App() {
  console.log('App rendering...');
  
  return (
    <GoogleOAuthProvider 
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error('Google Script failed to load')}
    >
      <AuthProvider>
        <TutorialProvider>
          <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/tech-tree-standalone" element={<StandaloneTechTreePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/enterprise" element={<EnterpriseContactPage />} />
            <Route path="/tech-tree" element={<TechTreePage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/adopt" element={<AdoptPage />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
            </Route>
              <Route path="/agents" element={<AgentsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/DAOs" element={<DAOsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/GPUs" element={<GPUsPage />} />
            <Route path="/models" element={<ModelsPage />} />
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
        </TutorialProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
