'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Lang, translations } from '@/lib/i18n'

type LanguageContextType = {
  lang: Lang
  t: typeof translations['en']
  toggleLang: () => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: translations['en'],
  toggleLang: () => {},
  isRTL: false,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'))

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: translations[lang],
        toggleLang,
        isRTL: lang === 'ar',
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
