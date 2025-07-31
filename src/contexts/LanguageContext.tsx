import { createContext, useContext, ReactNode } from 'react';

export type Language = 'pl' | 'en' | 'cs' | 'sk' | 'de';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pl',
  setLanguage: () => {}
});

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    language: 'pl' as Language,
    setLanguage: () => {}
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};