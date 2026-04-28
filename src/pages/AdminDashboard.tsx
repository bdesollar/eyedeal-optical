import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isCurrentUserAdmin } from '../lib/adminAuth'
import { siteChatLabel } from '../lib/siteChatLabels'
import AdminAppointmentsView from '../components/appointments/admin/AdminAppointmentsView'
import type { Appointment } from '../types'

type ContactRow = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  source: string
  created_at: string
}

type VisitRow = {
  id: string
  path: string
  referrer: string | null
  user_agent: string | null
  visitor_key: string | null
  created_at: string
}

type SiteChatRow = {
  id: string
  user_message: string
  assistant_reply: string
  category: string
  path: string | null
  visitor_key: string | null
  created_at: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [visits, setVisits] = useState<VisitRow[]>([])
  const [siteChat, setSiteChat] = useState<SiteChatRow[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [tab, setTab] = useState<'appointments' | 'contact' | 'siteChat' | 'visits'>('appointments')
  const [chatSort, setChatSort] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        navigate('/admin/login', { replace: true })
        return
      }
      const ok = await isCurrentUserAdmin()
      if (cancelled) return
      if (!ok) {
        await supabase.auth.signOut()
        navigate('/admin/login', { replace: true })
        return
      }
      setAllowed(true)
      setReady(true)

      const [apRes, ctRes, vRes, chRes] = await Promise.all([
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('page_visits').select('*').order('created_at', { ascending: false }).limit(500),
        supabase.from('site_chat_log').select('*').order('created_at', { ascending: false }).limit(500),
      ])
      if (cancelled) return
      if (apRes.error || ctRes.error || vRes.error || chRes.error) {
        setLoadError(
          [apRes.error?.message, ctRes.error?.message, vRes.error?.message, chRes.error?.message]
            .filter(Boolean)
            .join(' · '),
        )
        return
      }
      setAppointments((apRes.data ?? []) as Appointment[])
      setContacts((ctRes.data ?? []) as ContactRow[])
      setVisits((vRes.data ?? []) as VisitRow[])
      setSiteChat((chRes.data ?? []) as SiteChatRow[])
    })()
    return () => {
      cancelled = true
    }
  }, [navigate])

  const refetchAppointments = useCallback(async () => {
    const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(300)
    if (error) {
      setLoadError(error.message)
      return
    }
    setAppointments((data ?? []) as Appointment[])
  }, [])

  const siteChatSorted = useMemo(() => {
    const rows = [...siteChat]
    rows.sort((a, b) => {
      const da = new Date(a.created_at).getTime()
      const db = new Date(b.created_at).getTime()
      return chatSort === 'newest' ? db - da : da - db
    })
    return rows
  }, [siteChat, chatSort])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  if (!ready || !allowed) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Loading…</p>
      </div>
    )
  }

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="admin-header-inner">
          <h1 className="admin-header-title">Admin</h1>
          <div className="admin-header-actions">
            <Link to="/" className="admin-link-btn">
              View site
            </Link>
            <button type="button" className="admin-link-btn" onClick={() => void handleSignOut()}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {loadError && <p className="admin-banner">{loadError}</p>}

        <nav className="admin-tabs" aria-label="Data sections">
          <button type="button" className={tab === 'appointments' ? 'active' : ''} onClick={() => setTab('appointments')}>
            Appointments ({appointments.length})
          </button>
          <button type="button" className={tab === 'contact' ? 'active' : ''} onClick={() => setTab('contact')}>
            Contact forms ({contacts.length})
          </button>
          <button type="button" className={tab === 'siteChat' ? 'active' : ''} onClick={() => setTab('siteChat')}>
            Site chat ({siteChat.length})
          </button>
          <button type="button" className={tab === 'visits' ? 'active' : ''} onClick={() => setTab('visits')}>
            Visits ({visits.length})
          </button>
        </nav>

        {tab === 'appointments' && <AdminAppointmentsView appointments={appointments} onRefresh={refetchAppointments} />}

        {tab === 'siteChat' && (
          <div>
            <div className="admin-chat-toolbar">
              <label className="admin-chat-sort">
                <span>Sort by time</span>
                <select
                  value={chatSort}
                  onChange={(e) => setChatSort(e.target.value as 'newest' | 'oldest')}
                  className="admin-select"
                  aria-label="Sort site chat by time"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </label>
              <p className="admin-chat-hint">Each row is a visitor’s question and the auto-reply sent from the chat widget (quick answers, not a live person).</p>
            </div>
            <div className="admin-table-wrap admin-table-wrap--chat">
              <table className="admin-table admin-table--chat">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Topic</th>
                    <th>User asked</th>
                    <th>Auto-reply</th>
                    <th>Page</th>
                    <th>Visitor</th>
                  </tr>
                </thead>
                <tbody>
                  {siteChatSorted.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="admin-empty">
                        No site chat yet. Exchanges are logged when people use the floating chat on the public site.
                      </td>
                    </tr>
                  ) : (
                    siteChatSorted.map((c) => (
                      <tr key={c.id}>
                        <td className="admin-cell-now">{formatDt(c.created_at)}</td>
                        <td>
                          <span className="admin-pill">{siteChatLabel(c.category)}</span>
                        </td>
                        <td className="admin-cell-clamp" title={c.user_message}>
                          {c.user_message}
                        </td>
                        <td className="admin-cell-notes admin-cell-clamp" title={c.assistant_reply}>
                          {c.assistant_reply}
                        </td>
                        <td className="admin-cell-tiny">{c.path || '—'}</td>
                        <td className="admin-cell-tiny" title={c.visitor_key ?? ''}>
                          {c.visitor_key ? shortId(c.visitor_key) : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'contact' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      No messages yet.
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id}>
                      <td>{formatDt(c.created_at)}</td>
                      <td>{c.source}</td>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.phone || '—'}</td>
                      <td className="admin-cell-notes">{c.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'visits' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Path</th>
                  <th>Visitor</th>
                  <th>Referrer</th>
                  <th>Device</th>
                </tr>
              </thead>
              <tbody>
                {visits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No visits logged yet.
                    </td>
                  </tr>
                ) : (
                  visits.map((v) => (
                    <tr key={v.id}>
                      <td>{formatDt(v.created_at)}</td>
                      <td>{v.path}</td>
                      <td title={v.visitor_key ?? ''}>{v.visitor_key ? shortId(v.visitor_key) : '—'}</td>
                      <td className="admin-cell-notes">{v.referrer || '—'}</td>
                      <td className="admin-cell-notes">{shortUa(v.user_agent)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

function formatDt(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

function shortId(s: string) {
  return s.length > 10 ? `${s.slice(0, 6)}…` : s
}

function shortUa(ua: string | null) {
  if (!ua) return '—'
  return ua.length > 72 ? `${ua.slice(0, 72)}…` : ua
}
