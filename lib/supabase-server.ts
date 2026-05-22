import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/** Cliente com JWT do utilizador (respeita RLS) */
export function createUserClient(accessToken: string): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not set')
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** Cliente service role — bypass RLS (apenas servidor) */
export function createServiceClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return null
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function verifyAdminFromToken(
  accessToken: string
): Promise<{ id: string; email: string } | null> {
  const client = createUserClient(accessToken)
  const {
    data: { user },
    error,
  } = await client.auth.getUser()

  if (error || !user) return null

  let cargo: string | null = null

  const { data: perfilClient } = await client
    .from('perfis')
    .select('cargo')
    .eq('id', user.id)
    .maybeSingle()

  if (perfilClient?.cargo) {
    cargo = perfilClient.cargo
  } else {
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase-admin')
      const admin = getSupabaseAdmin()
      const { data: perfilAdmin } = await admin
        .from('perfis')
        .select('cargo')
        .eq('id', user.id)
        .maybeSingle()
      cargo = perfilAdmin?.cargo ?? null
    } catch {
      return null
    }
  }

  if (!cargo || !['admin', 'instrutor'].includes(cargo)) return null

  return { id: user.id, email: user.email ?? '' }
}
