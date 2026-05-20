import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage');
    return saved || 'en';
  });

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  const t = (en, ur, sd) => {
    if (language === 'ur') return ur || en;
    if (language === 'sd') return sd || ur || en;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
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


