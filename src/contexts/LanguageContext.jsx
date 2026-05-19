import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Load language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('userLanguage') || 'en';
  });

  // Persist language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userLanguage', language);
    // Also update HTML lang attribute for accessibility
    document.documentElement.lang = language;
    // Keep structure same (LTR), only change font if needed
  }, [language]);

  const t = (en, ur, sd) => {
    if (language === 'ur') return ur || en;
    if (language === 'sd') return sd || ur || en;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};


