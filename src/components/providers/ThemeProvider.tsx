'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemePreset = 'heritage' | 'nordic' | 'botanical' | 'noir';

interface ThemeContextType {
  theme: ThemePreset;
  setTheme: (t: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreset>('heritage');

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('tb_theme') as ThemePreset;
      if (saved) {
        setThemeState(saved);
        document.documentElement.className = `theme-${saved}`;
      } else {
        document.documentElement.className = 'theme-heritage';
      }
    } catch {}
  }, []);

  const setTheme = (newTheme: ThemePreset) => {
    setThemeState(newTheme);
    try {
      sessionStorage.setItem('tb_theme', newTheme);
      document.documentElement.className = `theme-${newTheme}`;
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme} className={`theme-${theme} min-h-screen flex flex-col`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
