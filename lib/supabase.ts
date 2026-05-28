import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Customer = {
  id: string
  name: string
  phone: string
  referral_code: string
  created_at: string
}

export type ReferralVisit = {
  id: string
  visitor_name: string
  referrer_id: string
  status: 'pending' | 'confirmed'
  created_at: string
  customers?: Customer
}
