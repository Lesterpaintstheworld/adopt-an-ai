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
