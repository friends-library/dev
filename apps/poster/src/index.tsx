import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(container()).render(<App />);

function container(): ReactDOM.Container {
  const app = document.getElementById(`app`);
  if (!app) {
    throw new Error(`No element with id 'app' found in document`);
  }
  return app;
}
