import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS, readStorage, writeStorage } from '../lib/storage';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

const getInitialTheme = () => {
  const saved = readStorage(STORAGE_KEYS.theme, null);
  if (saved === 'light' || saved === 'dark') return saved;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0b' : '#ffffff');
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
