# Supabase admin setup (manual steps)

Use this checklist when wiring **staff email**, **password reset redirects**, invites, and the invite Edge Function.

---

## Checklist — Dashboard (do this first)

### A. Change the staff user email to `eyedealoptical1997@yahoo.com`

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select **your project**.
2. Go to **Authentication** (left sidebar) → **Users**.
3. Find the existing admin/staff row (current email).
4. Open the row menu (**⋯** or the user row) → **Edit user** / **Update user** (wording varies).
5. Set **Email** to: `eyedealoptical1997@yahoo.com` → save.
6. If your project has **Confirm email** enabled (**Authentication** → **Providers** → **Email**):  
   - Confirm the new address from the Yahoo inbox **or** use the Dashboard option to confirm the user so they can sign in.

### A2. If you can’t edit the user in the UI — use the SQL Editor

Auth users live in **`auth.users`**, not in your `public.*` tables. You can change the email with SQL (same as what the Supabase MCP `execute_sql` tool would run).

1. Dashboard → **SQL Editor** → New query.
2. **List users** (copy the `id` you want):

```sql
select id, email, created_at
from auth.users
order by created_at;
```

3. **Set the email** (replace the UUID with yours from step 2):

```sql
update auth.users
set
  email = 'eyedealoptical1997@yahoo.com',
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  updated_at = now()
where id = 'PASTE_USER_UUID_HERE';
```

4. Run the query. Sign in with the new email; `public.admin_allowlist` still keys off **user id**, so allowlist rows stay valid.

If sign-in still behaves oddly, clear any in-progress email change tokens (only if those columns exist — run step 2 on `auth.users` in the Table Editor or inspect with `\d auth.users`):

```sql
update auth.users
set
  email_change = null,
  email_change_token_new = null,
  email_change_token_current = null
where id = 'PASTE_USER_UUID_HERE';
```

### A3. Supabase MCP (`execute_sql`)

Cursor’s **user-supabase** MCP must be authenticated or `execute_sql` returns **Unauthorized**. Create a personal access token: [Supabase Dashboard](https://supabase.com/dashboard) → your **account** menu → **Access Tokens** → generate a token, then add it to the MCP server config (e.g. `SUPABASE_ACCESS_TOKEN` or the flag described in your MCP setup). Project ref for this repo’s linked CLI: **`zacccqichqrrsjqewgnn`** (see `supabase/.temp/project-ref`). After the token is set, the same SQL as **A2** can be run via MCP.

### B. Redirect URLs (required for “Forgot password” and invite links)

1. Still under **Authentication**, open **URL configuration**.
2. **Site URL**  
   Set this to your **main live site origin** (example: `https://www.your-domain.com`). No trailing path.
3. **Redirect URLs**  
   Add **each** full URL below (replace with your real production host). Supabase only allows redirects that appear in this list.

| Environment | Add this redirect URL |
|-------------|------------------------|
| Local (Vite default) | `http://localhost:5173/admin/update-password` |
| Local (other port) | `http://localhost:PORT/admin/update-password` |
| Production | `https://YOUR_PRODUCTION_DOMAIN/admin/update-password` |

Tips:

- If you use both `www` and bare domain, add **both** production variants (e.g. `https://example.com/...` and `https://www.example.com/...`).
- After saving, wait a few seconds and try **Forgot password** again from `/admin/login`.
- Invite emails also use this path (`SITE_URL` in Edge Function secrets should match the same origin you use in production).

---

## 3. Invite Edge Function secrets

After deploying `invite-admin-user` (see below), set secrets (CLI or Dashboard → **Edge Functions** → **Secrets**):

```bash
supabase secrets set SITE_URL=https://YOUR_PRODUCTION_DOMAIN
supabase secrets set OWNER_NOTIFY_EMAIL=eyedealoptical1997@yahoo.com
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set RESEND_FROM="Eyedeal Optical <mail@your-verified-domain>"
```

Set **`SUPABASE_SERVICE_ROLE_KEY`** as a function secret so `invite-admin-user` can call the Auth Admin API and insert into `admin_allowlist`. `SUPABASE_URL` and `SUPABASE_ANON_KEY` are usually injected for Edge Functions automatically.

Invite emails are sent by **Supabase Auth**. The **owner copy** to `OWNER_NOTIFY_EMAIL` uses [Resend](https://resend.com/). If `RESEND_API_KEY` is missing, invites still work but the owner is not emailed.

## 4. Deploy the function

From the repo root:

```bash
supabase functions deploy invite-admin-user
```

With JWT verification enabled (default), only requests with a valid Supabase user session reach your handler. The app sends this when calling `supabase.functions.invoke` while signed in.
