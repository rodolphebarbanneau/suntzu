import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/app';

import './styles.scss';

/* Root */
const root = createRoot(
  document.getElementById('root') as HTMLElement
);

/* Render popup */
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
