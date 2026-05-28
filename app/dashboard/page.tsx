'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn, logout } from '@/lib/auth'
import { useLang } from '@/context/LanguageContext'
import LangToggle from '@/components/LangToggle'
import OverviewTab from '@/components/dashboard/OverviewTab'
import CustomersTab from '@/components/dashboard/CustomersTab'
import GenerateLinkTab from '@/components/dashboard/GenerateLinkTab'
import ConfirmVisitsTab from '@/components/dashboard/ConfirmVisitsTab'

export default function DashboardPage() {
  const router = useRouter()
  const { t, isRTL } = useLang()
  const [activeTab, setActiveTab] = useState(0)
  const [authChecked, setAuthChecked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
    } else {
      setAuthChecked(true)
    }
    setLoading(false)
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="animate-spin w-10 h-10 border-4 border-[#1D9E75] border-t-transparent rounded-full" />
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  )

  if (!authChecked) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const tabs = t.dashboard.tabs
  const tabComponents = [
    <OverviewTab key="overview" />,
    <CustomersTab key="customers" />,
    <GenerateLinkTab key="generate" />,
    <ConfirmVisitsTab key="confirm" />,
  ]

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-lg">{t.storeName}</span>
            </div>
            <div className="flex items-center gap-3">
              <LangToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t.dashboard.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === idx
                    ? 'border-[#1D9E75] text-[#1D9E75]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabComponents[activeTab]}
      </main>
    </div>
  )
}
