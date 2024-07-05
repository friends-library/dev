import * as React from 'react';
import ReactDOM from 'react-dom/client';
import Styleguide from './components/Styleguide';

ReactDOM.createRoot(container()).render(<Styleguide />);

// lol should SSR this instead ¯\_(ツ)_/¯
if (window.location.hash) {
  const id = window.location.hash.replace(/^#/, ``);
  const el = document.getElementById(id);
  if (el) {
    setTimeout(() => el.scrollIntoView(), 750);
  }
}

function container(): ReactDOM.Container {
  const app = document.getElementById(`root`);
  if (!app) {
    throw new Error(`No element with id 'root' found in document`);
  }
  return app;
}
