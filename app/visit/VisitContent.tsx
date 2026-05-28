'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { supabase, Customer } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'
import LangToggle from '@/components/LangToggle'

export default function VisitContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const { t, isRTL } = useLang()
  const vt = t.visit

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [invalid, setInvalid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [visitorName, setVisitorName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!ref) { setInvalid(true); setLoading(false); return }
    supabase
      .from('customers')
      .select('*')
      .eq('referral_code', ref)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setInvalid(true) }
        else { setCustomer(data) }
        setLoading(false)
      })
  }, [ref])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customer) return
    setSubmitting(true)
    const { error } = await supabase.from('visits').insert({
      visitor_name: visitorName.trim(),
      referrer_id: customer.id,
      status: 'pending',
    })
    setSubmitting(false)
    if (error) {
      toast.error('Something went wrong. Please try again.')
    } else {
      setDone(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#1D9E75] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LangToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1D9E75] to-[#15765A] px-8 pt-10 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur mb-4">
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">{t.storeName}</h1>
          </div>

          <div className="px-8 py-8">
            {invalid ? (
              /* Invalid referral */
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{vt.invalidLink}</h2>
                <p className="text-sm text-gray-500">{vt.invalidLinkDesc}</p>
              </div>
            ) : done ? (
              /* Thank you */
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{vt.thankYou}</h2>
              </div>
            ) : (
              /* Visit form */
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <p className="text-gray-800 font-medium">{vt.welcome}</p>
                  {customer && (
                    <p className="text-sm text-gray-500">
                      {vt.referredBy}{' '}
                      <span className="font-semibold text-[#1D9E75]">{customer.name}</span>
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {vt.yourName}
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={e => setVisitorName(e.target.value)}
                      placeholder={vt.namePlaceholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1D9E75] hover:bg-[#17845F] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 text-sm"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        ...
                      </span>
                    ) : vt.submit}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">{t.storeName} &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
