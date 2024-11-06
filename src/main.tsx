import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './ErrorBoundary';
import App from './App';

// Override console.error to filter ResizeObserver warnings
const consoleError = console.error;
console.error = (...args: any[]) => {
  if (args[0]?.includes?.('ResizeObserver')) return;
  consoleError(...args);
};

// Add global error handler
window.onerror = (message, source, lineno, colno, error) => {
  // Ignore ResizeObserver errors
  if (message === 'ResizeObserver loop completed with undelivered notifications.') {
    return;
  }
  console.error('Global error:', { message, source, lineno, colno, error });
};

// Add promise rejection handler
window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

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
