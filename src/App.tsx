import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './utils/theme';
import { MainLayout } from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import EnterpriseContactPage from './pages/EnterpriseContactPage';
import { TechTreePage } from './pages/TechTreePage';
import MissionsPage from './pages/MissionsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

console.log('App component initializing...');

function App() {
  console.log('App rendering...');
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/enterprise" element={<EnterpriseContactPage />} />
            <Route path="/tech-tree" element={<TechTreePage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
