import { supabase } from './supabase'

export async function isCurrentUserAdmin(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data, error } = await supabase.from('admin_allowlist').select('user_id').eq('user_id', user.id).maybeSingle()
  return !error && !!data
}
