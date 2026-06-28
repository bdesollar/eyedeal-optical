import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: 'Server misconfigured: missing Supabase env' }, 500)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const {
    data: { user },
    error: userErr,
  } = await userClient.auth.getUser()

  if (userErr || !user) {
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: allowed, error: allowErr } = await adminClient
    .from('admin_allowlist')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (allowErr || !allowed) {
    return jsonResponse({ error: 'Forbidden: not an admin' }, 403)
  }

  let body: { email?: string }
  try {
    body = (await req.json()) as { email?: string }
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: 'Valid email is required' }, 400)
  }

  const siteUrl = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '')
  if (!siteUrl) {
    return jsonResponse({ error: 'SITE_URL secret is not set for this function' }, 500)
  }

  const redirectTo = `${siteUrl}/admin/update-password`

  const { data: invited, error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo,
  })

  if (inviteErr || !invited?.user?.id) {
    return jsonResponse({ error: inviteErr?.message ?? 'Invite failed' }, 400)
  }

  const newUserId = invited.user.id

  const { error: insertErr } = await adminClient.from('admin_allowlist').insert({ user_id: newUserId })

  if (insertErr) {
    console.error('admin_allowlist insert failed after invite', insertErr)
    return jsonResponse(
      {
        error: 'User was invited but allowlist update failed. Add them manually in admin_allowlist.',
        userId: newUserId,
      },
      500,
    )
  }

  const ownerEmail = Deno.env.get('OWNER_NOTIFY_EMAIL') ?? 'eyedealoptical1997@yahoo.com'
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const resendFrom = Deno.env.get('RESEND_FROM')
  let ownerNotified = false
  let ownerNotifyWarning: string | undefined

  if (!resendKey || !resendFrom) {
    ownerNotifyWarning = 'Invite sent. Configure RESEND_API_KEY and RESEND_FROM to email the owner copy.'
  } else {
    const inviterLine = user.email ? `Invited by: ${user.email}` : 'Invited by: (unknown)'
    const text = [
      `An administrator invite was sent to ${email} at ${new Date().toISOString()}.`,
      '',
      inviterLine,
    ].join('\n')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [ownerEmail],
        subject: 'Eyedeal Optical: admin invite sent',
        text,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Resend failed', errText)
      ownerNotifyWarning = `Invite sent, but owner notification email failed: ${errText.slice(0, 200)}`
    } else {
      ownerNotified = true
    }
  }

  return jsonResponse({
    ok: true,
    ownerNotified,
    ownerNotifyWarning,
    invitedEmail: email,
  })
})
