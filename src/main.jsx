import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeProvider';
import { ToastProvider } from './context/ToastProvider';
import { LibraryProvider } from './context/LibraryProvider';
import { MoviesProvider } from './context/MoviesProvider';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <LibraryProvider>
            <MoviesProvider>
              <App />
            </MoviesProvider>
          </LibraryProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
