'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, translations } from '@/lib/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_KEY = 'multisow_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(LANG_KEY) as SupportedLanguage;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      // ignore
    }
  };

  const t = (key: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English
    if (translations['en'][key]) {
      return translations['en'][key];
    }
    return key;
  };

  // Prevent hydration mismatch by not rendering until client-side
  // or render with default 'en' and update after.
  // Rendering children immediately with 'en' is fine for SEO,
  // but might cause a flash of English text before translating.
  // Given it's an app dashboard, a small flash is acceptable or we can just render it.

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
