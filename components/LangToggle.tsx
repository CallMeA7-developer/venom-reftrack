'use client'

import { useLang } from '@/context/LanguageContext'

export default function LangToggle() {
  const { lang, toggleLang } = useLang()

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors shadow-sm"
      title={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <span className="text-base">{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
      <span>{lang === 'en' ? 'العربية' : 'English'}</span>
    </button>
  )
}
