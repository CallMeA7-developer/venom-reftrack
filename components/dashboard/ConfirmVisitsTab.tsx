'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase, ReferralVisit } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'

export default function ConfirmVisitsTab() {
  const { t } = useLang()
  const cv = t.dashboard.confirmVisits
  const [visits, setVisits] = useState<ReferralVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)

  useEffect(() => { fetchVisits() }, [])

  async function fetchVisits() {
    setLoading(true)
    const { data } = await supabase
      .from('visits')
      .select('*, customers(name)')
      .order('created_at', { ascending: false })
    setVisits(data || [])
    setLoading(false)
  }

  async function confirmVisit(id: string) {
    setConfirming(id)
    const { error } = await supabase
      .from('visits')
      .update({ status: 'confirmed' })
      .eq('id', id)
    setConfirming(null)
    if (error) {
      toast.error('Failed to confirm visit')
    } else {
      toast.success('Visit confirmed!')
      fetchVisits()
    }
  }

  const pending = visits.filter(v => v.status === 'pending')
  const confirmed = visits.filter(v => v.status === 'confirmed')

  const formatDate = (d: string) =>
    new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

  if (loading) return <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>

  return (
    <div className="space-y-8">
      {/* Pending */}
      <section>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
          {cv.pendingTitle}
          <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{pending.length}</span>
        </h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {pending.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">{cv.noPending}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[cv.visitorName, cv.referredBy, cv.dateTime, cv.action].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pending.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{v.visitor_name}</td>
                      <td className="px-4 py-3 text-gray-600">{v.customers?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(v.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => confirmVisit(v.id)}
                          disabled={confirming === v.id}
                          className="flex items-center gap-1.5 bg-[#1D9E75] hover:bg-[#17845F] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          {confirming === v.id ? (
                            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {cv.confirm}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Confirmed */}
      <section>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          {cv.confirmedTitle}
          <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{confirmed.length}</span>
        </h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {confirmed.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">{cv.noConfirmed}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[cv.visitorName, cv.referredBy, cv.dateTime, ''].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {confirmed.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{v.visitor_name}</td>
                      <td className="px-4 py-3 text-gray-600">{v.customers?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(v.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {cv.confirmed}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
