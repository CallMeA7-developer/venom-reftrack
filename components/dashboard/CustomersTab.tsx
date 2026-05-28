'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase, Customer } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'REF-'
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export default function CustomersTab() {
  const { t, isRTL } = useLang()
  const ct = t.dashboard.customers
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchCustomers() }, [])

  async function fetchCustomers() {
    setLoading(true)
    setError(null)
    const { data, error: sbError } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
    if (sbError || !data) {
      setError(ct.fetchError)
      setLoading(false)
      return
    }
    setCustomers(data)
    setLoading(false)
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete(id: string) {
    if (!confirm(ct.deleteConfirm)) return
    setDeleting(id)
    const { error } = await supabase.from('customers').delete().eq('id', id)
    setDeleting(null)
    if (error) {
      toast.error(ct.deleteFailed)
    } else {
      toast.success(ct.deleteSuccess)
      fetchCustomers()
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    // Generate unique code
    let code = generateCode()
    let attempts = 0
    while (attempts < 5) {
      const { data } = await supabase.from('customers').select('id').eq('referral_code', code).single()
      if (!data) break
      code = generateCode()
      attempts++
    }

    const { error } = await supabase.from('customers').insert({
      name: formName.trim(),
      phone: formPhone.trim(),
      referral_code: code,
    })

    setSubmitting(false)
    if (error) {
      toast.error('Failed to add customer')
    } else {
      toast.success('Customer added!')
      setFormName('')
      setFormPhone('')
      setShowForm(false)
      fetchCustomers()
    }
  }

  return (
    <div className="space-y-4">
      {/* Search + Add button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={ct.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] bg-white text-sm ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#1D9E75] hover:bg-[#17845F] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {ct.addCustomer}
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-900">{ct.addForm.title}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{ct.name}</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder={ct.addForm.namePlaceholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{ct.phone}</label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  placeholder={ct.addForm.phonePlaceholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {ct.addForm.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#1D9E75] hover:bg-[#17845F] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {submitting ? '...' : ct.addForm.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchCustomers}
              className="px-4 py-2 bg-[#1D9E75] hover:bg-[#17845F] text-white text-sm font-medium rounded-lg transition-colors"
            >
              {ct.tryAgain}
            </button>
          </div>
        </div>
      ) : (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">{ct.noCustomers}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[ct.name, ct.phone, ct.referralCode, ct.dateAdded, ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {c.referral_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deleting === c.id}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === c.id ? (
                          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                        {ct.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
