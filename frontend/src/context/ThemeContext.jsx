import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

/**
 * ThemeProvider — thanglish.py uses a single, fixed "Sage & Paper" theme.
 * No dark-mode or theme-switching is available.
 */
export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: 'sage' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
