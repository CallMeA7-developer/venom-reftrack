'use client'

import { useEffect, useState } from 'react'
import { supabase, Customer, ReferralVisit } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'

type ReferrerStat = { name: string; count: number }

export default function OverviewTab({ onViewAll }: { onViewAll?: () => void }) {
  const { t } = useLang()
  const ov = t.dashboard.overview
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalReferrals, setTotalReferrals] = useState(0)
  const [confirmedVisits, setConfirmedVisits] = useState(0)
  const [topReferrers, setTopReferrers] = useState<ReferrerStat[]>([])
  const [recentActivity, setRecentActivity] = useState<ReferralVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)
    const [custRes, visitsRes] = await Promise.all([
      supabase.from('customers').select('*'),
      supabase.from('visits').select('*, customers(name)').order('created_at', { ascending: false }),
    ])

    if (custRes.error || visitsRes.error) {
      setError(ov.fetchError)
      setLoading(false)
      return
    }

    const customers: Customer[] = custRes.data || []
    const visits: ReferralVisit[] = visitsRes.data || []

    setTotalCustomers(customers.length)
    setTotalReferrals(visits.length)
    setConfirmedVisits(visits.filter(v => v.status === 'confirmed').length)

    // Top 5 referrers
    const counts: Record<string, { name: string; count: number }> = {}
    visits.forEach(v => {
      const id = v.referrer_id
      const name = v.customers?.name || 'Unknown'
      if (!counts[id]) counts[id] = { name, count: 0 }
      counts[id].count++
    })
    const sorted = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5)
    setTopReferrers(sorted)

    setRecentActivity(visits.slice(0, 5))
    setLoading(false)
  }

  const maxCount = topReferrers[0]?.count || 1

  const metrics = [
    { label: ov.totalCustomers, value: totalCustomers, icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: ov.totalReferrals, value: totalReferrals, icon: '🔗', color: 'bg-purple-50 text-purple-600' },
    { label: ov.confirmedVisits, value: confirmedVisits, icon: '✅', color: 'bg-green-50 text-[#1D9E75]' },
  ]

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-sm text-gray-500">{error}</p>
      <button
        onClick={fetchData}
        className="px-4 py-2 bg-[#1D9E75] hover:bg-[#17845F] text-white text-sm font-medium rounded-lg transition-colors"
      >
        {ov.refresh}
      </button>
    </div>
  )

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Header row with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t.dashboard.tabs[0]}</h2>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#1D9E75] border border-gray-200 rounded-lg hover:border-[#1D9E75] transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {ov.refresh}
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{m.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{m.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${m.color}`}>
                {m.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referrers */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{ov.topReferrers}</h3>
          {topReferrers.length === 0 ? (
            <p className="text-gray-400 text-sm">{ov.noActivity}</p>
          ) : (
            <div className="space-y-3">
              {topReferrers.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-800">{r.name}</span>
                    <span className="text-gray-500">{r.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1D9E75] rounded-full transition-all"
                      style={{ width: `${(r.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{ov.recentActivity}</h3>
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-sm font-medium text-[#1D9E75] hover:underline"
              >
                {ov.viewAll}
              </button>
            )}
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-gray-400 text-sm">{ov.noActivity}</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(v => (
                <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{v.visitor_name}</p>
                    <p className="text-xs text-gray-500">
                      {ov.referredBy}: {v.customers?.name || '—'}
                    </p>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useLang()
  const cv = t.dashboard.confirmVisits
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
      status === 'confirmed'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {status === 'confirmed' ? cv.confirmed : cv.pending}
    </span>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 h-56" />
        <div className="bg-white rounded-xl border border-gray-100 h-56" />
      </div>
    </div>
  )
}
