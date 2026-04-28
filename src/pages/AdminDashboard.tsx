import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isCurrentUserAdmin } from '../lib/adminAuth'
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

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [visits, setVisits] = useState<VisitRow[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [tab, setTab] = useState<'appointments' | 'messages' | 'visits'>('appointments')

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

      const [apRes, ctRes, vRes] = await Promise.all([
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('page_visits').select('*').order('created_at', { ascending: false }).limit(500),
      ])
      if (cancelled) return
      if (apRes.error || ctRes.error || vRes.error) {
        setLoadError([apRes.error?.message, ctRes.error?.message, vRes.error?.message].filter(Boolean).join(' · '))
        return
      }
      setAppointments((apRes.data ?? []) as Appointment[])
      setContacts((ctRes.data ?? []) as ContactRow[])
      setVisits((vRes.data ?? []) as VisitRow[])
    })()
    return () => {
      cancelled = true
    }
  }, [navigate])

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
          <button type="button" className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>
            Messages ({contacts.length})
          </button>
          <button type="button" className={tab === 'visits' ? 'active' : ''} onClick={() => setTab('visits')}>
            Visits ({visits.length})
          </button>
        </nav>

        {tab === 'appointments' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Date / time</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-empty">
                      No appointment requests yet.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.id}>
                      <td>{formatDt(a.created_at)}</td>
                      <td>{a.patient_name}</td>
                      <td>{a.email}</td>
                      <td>{a.phone || '—'}</td>
                      <td>{a.appointment_type}</td>
                      <td>
                        {a.preferred_date} {a.preferred_time}
                      </td>
                      <td className="admin-cell-notes">{a.notes || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'messages' && (
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
