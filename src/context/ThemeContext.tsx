import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system' | 'custom';

export type CustomAccent = 'crimson' | 'sapphire' | 'emerald' | 'amethyst';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  customAccent: CustomAccent;
  setMode: (mode: ThemeMode) => void;
  setCustomAccent: (accent: CustomAccent) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'bdms-theme-mode';
const ACCENT_STORAGE_KEY = 'bdms-custom-accent';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system' || saved === 'custom') {
      return saved;
    }
    return 'light'; // default initial clean light mode
  });

  const [customAccent, setCustomAccentState] = useState<CustomAccent>(() => {
    const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (saved === 'crimson' || saved === 'sapphire' || saved === 'emerald' || saved === 'amethyst') {
      return saved;
    }
    return 'crimson';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen for system OS color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute actual resolved theme (light or dark)
  const resolvedTheme: 'light' | 'dark' =
    mode === 'dark' || mode === 'custom'
      ? 'dark'
      : mode === 'system'
      ? systemIsDark
        ? 'dark'
        : 'light'
      : 'light';

  // Apply classes to documentElement
  useEffect(() => {
    const root = document.documentElement;

    // Toggle dark class
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Toggle custom mode class
    if (mode === 'custom') {
      root.classList.add('theme-custom');
      root.setAttribute('data-accent', customAccent);
    } else {
      root.classList.remove('theme-custom');
      root.removeAttribute('data-accent');
    }

    root.setAttribute('data-theme-mode', mode);
  }, [resolvedTheme, mode, customAccent]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
  }, []);

  const setCustomAccent = useCallback((accent: CustomAccent) => {
    setCustomAccentState(accent);
    localStorage.setItem(ACCENT_STORAGE_KEY, accent);
  }, []);

  // Quick toggle cycles: light -> dark -> custom -> system -> light
  const toggleTheme = useCallback(() => {
    setModeState((current) => {
      let next: ThemeMode = 'dark';
      if (current === 'light') next = 'dark';
      else if (current === 'dark') next = 'custom';
      else if (current === 'custom') next = 'system';
      else if (current === 'system') next = 'light';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedTheme,
        customAccent,
        setMode,
        setCustomAccent,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
