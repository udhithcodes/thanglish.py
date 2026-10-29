import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { id: 'english', label: 'English', sub: 'Original' },
  { id: 'tanglish', label: 'Tanglish', sub: 'Tamil in English' },
  { id: 'ta', label: 'தமிழ்', sub: 'Tamil Script' },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('thanglish_language') || 'tanglish';
  });

  const [compareMode, setCompareMode] = useState(() => {
    return localStorage.getItem('thanglish_compare') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('thanglish_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('thanglish_compare', compareMode);
  }, [compareMode]);

  const toggleCompareMode = () => setCompareMode(prev => !prev);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      compareMode,
      setCompareMode,
      toggleCompareMode,
      languages: LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
