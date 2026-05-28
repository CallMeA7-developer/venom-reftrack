'use client'

import { useEffect, useState } from 'react'
import { supabase, Customer, ReferralVisit } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'

type ReferrerStat = { name: string; count: number }

export default function OverviewTab() {
  const { t } = useLang()
  const ov = t.dashboard.overview
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalReferrals, setTotalReferrals] = useState(0)
  const [confirmedVisits, setConfirmedVisits] = useState(0)
  const [topReferrers, setTopReferrers] = useState<ReferrerStat[]>([])
  const [recentActivity, setRecentActivity] = useState<ReferralVisit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [custRes, visitsRes] = await Promise.all([
      supabase.from('customers').select('*'),
      supabase.from('visits').select('*, customers(name)').order('created_at', { ascending: false }),
    ])

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

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
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
          <h3 className="font-semibold text-gray-900 mb-4">{ov.recentActivity}</h3>
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
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
      status === 'confirmed'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {status}
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
