import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

// Add global error handler
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
};

// Add promise rejection handler
window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
};

console.log('Starting app initialization...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

console.log('Root element found, attempting to render...');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error during app initialization:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>Failed to initialize app</h1>
    <pre>${error instanceof Error ? error.message : String(error)}</pre>
  </div>`;
}
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import AdoptPage from './pages/AdoptPage'
import MissionsPage from './pages/MissionsPage'
import TechTreePage from './pages/TechTreePage'
import PricingPage from './pages/PricingPage'
import NotFoundPage from './pages/NotFoundPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/adopt" element={<AdoptPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/tech-tree" element={<TechTreePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
