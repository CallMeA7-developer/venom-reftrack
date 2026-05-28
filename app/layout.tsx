import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Venom Store — Referral Tracker',
  description: 'Referral tracking system for Venom Store',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <LanguageProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </LanguageProvider>
      </body>
    </html>
  )
}
