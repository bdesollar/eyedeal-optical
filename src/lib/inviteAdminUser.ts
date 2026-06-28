import { supabase } from './supabase'

export type InviteAdminResult =
  | { ok: true; ownerNotified: boolean; ownerNotifyWarning?: string; invitedEmail: string }
  | { ok: false; error: string }

export async function inviteAdminUser(email: string): Promise<InviteAdminResult> {
  const trimmed = email.trim()
  const { data, error } = await supabase.functions.invoke<{
    ok?: boolean
    error?: string
    ownerNotified?: boolean
    ownerNotifyWarning?: string
    invitedEmail?: string
  }>('invite-admin-user', {
    body: { email: trimmed },
  })

  const payload = data as Record<string, unknown> | null
  if (payload?.error && typeof payload.error === 'string') {
    return { ok: false, error: payload.error }
  }

  if (error) {
    return { ok: false, error: error.message }
  }

  if (payload?.ok === true && typeof payload.invitedEmail === 'string') {
    return {
      ok: true,
      ownerNotified: payload.ownerNotified === true,
      ownerNotifyWarning: typeof payload.ownerNotifyWarning === 'string' ? payload.ownerNotifyWarning : undefined,
      invitedEmail: payload.invitedEmail,
    }
  }

  return { ok: false, error: 'Unexpected response from invite service' }
}
