import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';

store().then((store) => {
  const root = ReactDOM.createRoot(container());
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
});

function container(): ReactDOM.Container {
  const app = document.getElementById(`root`);
  if (!app) {
    throw new Error(`No element with id 'root' found in document`);
  }
  return app;
}
