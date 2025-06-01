import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDark: false
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });
  
  const [isDark, setIsDark] = useState(false);
  
  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Apply theme
  useEffect(() => {
    const applyTheme = () => {
      let darkMode = false;
      
      if (theme === 'system') {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        darkMode = theme === 'dark';
      }
      
      setIsDark(darkMode);
      
      // Apply dark mode to document
      document.documentElement.classList.toggle('dark', darkMode);
    };
    
    applyTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};