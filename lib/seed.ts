import { supabase } from './supabase'

const customers = [
  { name: 'Ali Hassan', phone: '+971501234567', referral_code: 'REF-ALI01' },
  { name: 'Sara Mohammed', phone: '+971502345678', referral_code: 'REF-SAR02' },
  { name: 'Omar Khalid', phone: '+971503456789', referral_code: 'REF-OMA03' },
  { name: 'Fatima Nasser', phone: '+971504567890', referral_code: 'REF-FAT04' },
  { name: 'Khalid Rashid', phone: '+971505678901', referral_code: 'REF-KHA05' },
  { name: 'Noura Ahmed', phone: '+971506789012', referral_code: 'REF-NOU06' },
  { name: 'Yousef Salem', phone: '+971507890123', referral_code: 'REF-YOU07' },
  { name: 'Maryam Tariq', phone: '+971508901234', referral_code: 'REF-MAR08' },
  { name: 'Hassan Ali', phone: '+971509012345', referral_code: 'REF-HAS09' },
  { name: 'Dana Hamad', phone: '+971510123456', referral_code: 'REF-DAN10' },
  { name: 'Tariq Saeed', phone: '+971511234567', referral_code: 'REF-TAR11' },
  { name: 'Layla Omar', phone: '+971512345678', referral_code: 'REF-LAY12' },
  { name: 'Faisal Nasser', phone: '+971513456789', referral_code: 'REF-FAI13' },
  { name: 'Hessa Khalid', phone: '+971514567890', referral_code: 'REF-HES14' },
  { name: 'Saeed Mohammed', phone: '+971515678901', referral_code: 'REF-SAE15' },
  { name: 'Aisha Rashid', phone: '+971516789012', referral_code: 'REF-AIS16' },
  { name: 'Majid Hassan', phone: '+971517890123', referral_code: 'REF-MAJ17' },
  { name: 'Reem Salem', phone: '+971518901234', referral_code: 'REF-REE18' },
  { name: 'Nasser Ahmed', phone: '+971519012345', referral_code: 'REF-NAS19' },
  { name: 'Shaikha Omar', phone: '+971520123456', referral_code: 'REF-SHA20' },
]

const visits = [
  { visitor_name: 'Ahmed Salem', referrer_code: 'REF-ALI01', status: 'confirmed' },
  { visitor_name: 'Bilal Nasser', referrer_code: 'REF-ALI01', status: 'confirmed' },
  { visitor_name: 'Camelia Hassan', referrer_code: 'REF-ALI01', status: 'pending' },
  { visitor_name: 'Dalal Yousef', referrer_code: 'REF-SAR02', status: 'confirmed' },
  { visitor_name: 'Essa Khalid', referrer_code: 'REF-SAR02', status: 'confirmed' },
  { visitor_name: 'Farah Tariq', referrer_code: 'REF-SAR02', status: 'pending' },
  { visitor_name: 'Ghanem Ali', referrer_code: 'REF-OMA03', status: 'confirmed' },
  { visitor_name: 'Hind Saeed', referrer_code: 'REF-OMA03', status: 'pending' },
  { visitor_name: 'Ibrahim Hamad', referrer_code: 'REF-FAT04', status: 'confirmed' },
  { visitor_name: 'Joud Rashid', referrer_code: 'REF-FAT04', status: 'confirmed' },
  { visitor_name: 'Kareem Nasser', referrer_code: 'REF-KHA05', status: 'pending' },
  { visitor_name: 'Lina Mohammed', referrer_code: 'REF-KHA05', status: 'confirmed' },
  { visitor_name: 'Mazen Omar', referrer_code: 'REF-NOU06', status: 'confirmed' },
  { visitor_name: 'Nada Hassan', referrer_code: 'REF-NOU06', status: 'pending' },
  { visitor_name: 'Omar Faisal', referrer_code: 'REF-YOU07', status: 'confirmed' },
  { visitor_name: 'Priya Salem', referrer_code: 'REF-YOU07', status: 'confirmed' },
  { visitor_name: 'Qais Tariq', referrer_code: 'REF-MAR08', status: 'pending' },
  { visitor_name: 'Rana Khalid', referrer_code: 'REF-MAR08', status: 'confirmed' },
  { visitor_name: 'Sami Ali', referrer_code: 'REF-HAS09', status: 'confirmed' },
  { visitor_name: 'Tala Hamad', referrer_code: 'REF-HAS09', status: 'pending' },
  { visitor_name: 'Umar Rashid', referrer_code: 'REF-DAN10', status: 'confirmed' },
  { visitor_name: 'Vera Nasser', referrer_code: 'REF-DAN10', status: 'confirmed' },
  { visitor_name: 'Waleed Saeed', referrer_code: 'REF-TAR11', status: 'pending' },
  { visitor_name: 'Xena Mohammed', referrer_code: 'REF-TAR11', status: 'confirmed' },
  { visitor_name: 'Yara Omar', referrer_code: 'REF-LAY12', status: 'confirmed' },
  { visitor_name: 'Ziad Hassan', referrer_code: 'REF-LAY12', status: 'pending' },
  { visitor_name: 'Abdulla Salem', referrer_code: 'REF-FAI13', status: 'confirmed' },
  { visitor_name: 'Bader Tariq', referrer_code: 'REF-FAI13', status: 'confirmed' },
  { visitor_name: 'Chahd Khalid', referrer_code: 'REF-HES14', status: 'pending' },
  { visitor_name: 'Dina Ali', referrer_code: 'REF-HES14', status: 'confirmed' },
  { visitor_name: 'Eisa Hamad', referrer_code: 'REF-SAE15', status: 'confirmed' },
  { visitor_name: 'Fatma Rashid', referrer_code: 'REF-SAE15', status: 'pending' },
  { visitor_name: 'Ghalia Nasser', referrer_code: 'REF-AIS16', status: 'confirmed' },
  { visitor_name: 'Hamad Saeed', referrer_code: 'REF-AIS16', status: 'confirmed' },
  { visitor_name: 'Iman Mohammed', referrer_code: 'REF-MAJ17', status: 'pending' },
  { visitor_name: 'Jasem Omar', referrer_code: 'REF-MAJ17', status: 'confirmed' },
  { visitor_name: 'Khawla Hassan', referrer_code: 'REF-REE18', status: 'confirmed' },
  { visitor_name: 'Loay Salem', referrer_code: 'REF-NAS19', status: 'pending' },
  { visitor_name: 'Marwa Tariq', referrer_code: 'REF-NAS19', status: 'confirmed' },
  { visitor_name: 'Nawaf Khalid', referrer_code: 'REF-SHA20', status: 'confirmed' },
]

export async function seedDatabase(): Promise<void> {
  // Step 0: Clear existing data (visits first to avoid FK constraint errors)
  await supabase.from('visits').delete().neq('id', '')
  await supabase.from('customers').delete().neq('id', '')

  // Step 1: Insert all 20 customers
  const { error: custError } = await supabase.from('customers').insert(customers)
  if (custError) throw new Error(`Failed to insert customers: ${custError.message}`)

  // Step 2: Fetch all inserted customers to get their IDs
  const { data: inserted, error: fetchError } = await supabase
    .from('customers')
    .select('id, referral_code')
    .in('referral_code', customers.map(c => c.referral_code))
  if (fetchError) throw new Error(`Failed to fetch customer IDs: ${fetchError.message}`)

  // Build a referral_code → id lookup map
  const codeToId: Record<string, string> = {}
  for (const c of inserted ?? []) {
    codeToId[c.referral_code] = c.id
  }

  // Step 3: Build visit rows using resolved referrer IDs
  const visitRows = visits.map(v => {
    const referrer_id = codeToId[v.referrer_code]
    if (!referrer_id) throw new Error(`Could not resolve referrer_id for code: ${v.referrer_code}`)
    return {
      visitor_name: v.visitor_name,
      referrer_id,
      status: v.status,
    }
  })

  const { error: visitError } = await supabase.from('visits').insert(visitRows)
  if (visitError) throw new Error(`Failed to insert visits: ${visitError.message}`)
}
