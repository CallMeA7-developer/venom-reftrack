'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase, Customer } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'

export default function GenerateLinkTab() {
  const { t, isRTL } = useLang()
  const gl = t.dashboard.generateLink
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selected, setSelected] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.from('customers').select('*').order('name').then(({ data }) => {
      setCustomers(data || [])
      setLoading(false)
    })
  }, [])

  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'
  const referralLink = selected ? `${domain}/visit?ref=${selected.referral_code}` : ''

  async function handleCopy() {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success(gl.copied)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">{gl.title}</h3>

        {/* Customer select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {gl.selectCustomer}
          </label>
          <select
            value={selected?.id || ''}
            onChange={e => {
              const c = customers.find(c => c.id === e.target.value) || null
              setSelected(c)
              setCopied(false)
            }}
            className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] text-sm bg-white ${isRTL ? 'text-right' : ''}`}
            disabled={loading}
          >
            <option value="">{gl.selectCustomer}</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.referral_code}</option>
            ))}
          </select>
        </div>

        {/* Link display */}
        {selected && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{gl.referralLink}</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 font-mono select-all"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  copied
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-[#1D9E75] hover:bg-[#17845F] text-white'
                }`}
              >
                {copied ? '✓ ' + gl.copied : gl.copy}
              </button>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#1D9E75] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {gl.instruction}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
