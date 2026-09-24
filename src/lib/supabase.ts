import { createClient } from '@supabase/supabase-js'
import type { User as SupaUser, Session } from '@supabase/supabase-js'

// Supabase project credentials. Replace with real values after project setup.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'tradeed-auth',
  },
})

export type AppRole = 'student' | 'admin'
export type AppPlan = 'FREE' | 'STARTER' | 'PREMIUM'

export interface TradeEdUser {
  id: string
  name: string
  email: string
  role: AppRole
  plan: AppPlan
  phone?: string
  city?: string
  experience?: string
  avatarUrl?: string
  createdAt?: string
}

function toAppUser(supa: SupaUser, meta?: Record<string, any>): TradeEdUser {
  const role: AppRole = (meta?.role as AppRole) || (supa.user_metadata?.role as AppRole) || 'student'
  const plan: AppPlan = (meta?.plan as AppPlan) || (supa.user_metadata?.plan as AppPlan) || 'FREE'
  return {
    id: supa.id,
    name: (meta?.name as string) || supa.user_metadata?.name || supa.email?.split('@')[0] || 'Student',
    email: supa.email || '',
    role,
    plan,
    phone: meta?.phone || supa.user_metadata?.phone,
    city: meta?.city || supa.user_metadata?.city,
    experience: meta?.experience || supa.user_metadata?.experience,
    avatarUrl: meta?.avatar_url || supa.user_metadata?.avatar_url,
    createdAt: supa.created_at,
  }
}

/* ---------------- Auth ---------------- */

export async function signUpStudent(input: {
  name: string
  email: string
  password: string
  experience?: string
  phone?: string
  city?: string
}): Promise<{ user?: TradeEdUser; error?: string }> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: 'student',
        plan: 'FREE',
        experience: input.experience,
        phone: input.phone,
        city: input.city,
      },
    },
  })
  if (error) return { error: error.message }
  if (!data.user) return { error: 'No user returned' }
  return { user: toAppUser(data.user) }
}

export async function signInStudent(input: {
  email: string
  password: string
}): Promise<{ user?: TradeEdUser; error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })
  if (error) return { error: error.message }
  if (!data.user) return { error: 'No user returned' }
  // Fetch the authoritative role/plan from profiles, not signup metadata.
  // This ensures an admin who changed their role in the DB is recognized.
  const meta = await fetchProfile(data.user.id)
  return { user: toAppUser(data.user, meta) }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function resetPasswordEmail(email: string): Promise<{ error?: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  })
  return { error: error?.message }
}

export async function updatePassword(newPassword: string): Promise<{ error?: string }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error: error?.message }
}

/* ---------------- Session ---------------- */

export async function getCurrentSession(): Promise<TradeEdUser | null> {
  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) return null
  const meta = await fetchProfile(data.session.user.id)
  return toAppUser(data.session.user, meta)
}

export function onAuthChange(cb: (user: TradeEdUser | null) => void) {
  const { data } = supabase.auth.onAuthStateChange(async (_event, session: Session | null) => {
    if (!session?.user) {
      cb(null)
      return
    }
    const meta = await fetchProfile(session.user.id)
    cb(toAppUser(session.user, meta))
  })
  return () => data.subscription.unsubscribe()
}

/* ---------------- Profile ---------------- */

export async function fetchProfile(userId: string): Promise<Record<string, any> | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role, plan, name, phone, city, experience, avatar_url')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateProfile(
  userId: string,
  fields: Partial<Pick<TradeEdUser, 'name' | 'phone' | 'city' | 'experience' | 'avatarUrl' | 'plan' | 'role'>>
): Promise<{ error?: string }> {
  const update: Record<string, any> = {}
  if (fields.name !== undefined) update.name = fields.name
  if (fields.phone !== undefined) update.phone = fields.phone
  if (fields.city !== undefined) update.city = fields.city
  if (fields.experience !== undefined) update.experience = fields.experience
  if (fields.avatarUrl !== undefined) update.avatar_url = fields.avatarUrl
  if (fields.plan !== undefined) update.plan = fields.plan
  if (fields.role !== undefined) update.role = fields.role
  if (Object.keys(update).length === 0) return {}

  const { error } = await supabase.from('profiles').update(update).eq('id', userId)
  return { error: error?.message }
}

/* ---------------- Admin: Students ---------------- */

export async function adminListStudents(): Promise<{ students?: TradeEdUser[]; error?: string }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
  if (error) return { error: error.message }
  return { students: (data || []).map((p: any) => toAppUserProfileRow(p)) }
}

/* ---------------- Subscriptions ---------------- */

export interface SubscriptionRequest {
  id: string
  user_id: string | null
  name: string
  email: string
  phone: string
  city?: string
  plan: AppPlan
  status: 'pending' | 'approved' | 'rejected'
  receipt_url?: string
  created_at: string
}

export async function submitSubscriptionRequest(input: {
  email: string
  name: string
  phone: string
  city?: string
  plan: AppPlan
  receiptUrl?: string
}): Promise<{ error?: string }> {
  const { error } = await supabase.from('subscription_requests').insert({
    email: input.email,
    name: input.name,
    phone: input.phone,
    city: input.city || null,
    plan: input.plan,
    receipt_url: input.receiptUrl || null,
    status: 'pending',
  })
  return { error: error?.message }
}

export async function adminListSubscriptionRequests(): Promise<{
  requests?: SubscriptionRequest[]
  error?: string
}> {
  const { data, error } = await supabase
    .from('subscription_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { error: error.message }
  return { requests: (data || []) as SubscriptionRequest[] }
}

function toAppUserProfileRow(p: any): TradeEdUser {
  return {
    id: p.id,
    name: p.name || p.email?.split('@')[0] || 'Student',
    email: p.email || '',
    role: p.role || 'student',
    plan: p.plan || 'FREE',
    phone: p.phone,
    city: p.city,
    experience: p.experience,
    avatarUrl: p.avatar_url,
    createdAt: p.created_at,
  }
}
