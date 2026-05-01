import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isCurrentUserAdmin } from '../lib/adminAuth'
import { siteChatLabel } from '../lib/siteChatLabels'

type ContactRow = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  source: string
  visitor_key?: string | null
  session_id?: string | null
  page_path?: string | null
  user_agent?: string | null
  ip_address?: string | null
  ip_city?: string | null
  ip_region?: string | null
  ip_country?: string | null
  created_at: string
}

type VisitRow = {
  id: string
  path: string
  referrer: string | null
  user_agent: string | null
  visitor_key: string | null
  session_id?: string | null
  screen_width?: number | null
  screen_height?: number | null
  language?: string | null
  timezone?: string | null
  ip_address?: string | null
  ip_city?: string | null
  ip_region?: string | null
  ip_country?: string | null
  ip_org?: string | null
  created_at: string
}

type SiteChatRow = {
  id: string
  user_message: string
  assistant_reply: string
  category: string
  path: string | null
  visitor_key: string | null
  session_id?: string | null
  user_agent?: string | null
  ip_address?: string | null
  ip_city?: string | null
  ip_region?: string | null
  ip_country?: string | null
  created_at: string
}

type AnalyticsEventRow = {
  id: string
  event_type: 'click' | 'section_time' | 'page_time' | 'section_view' | string
  path: string
  target_label: string | null
  target_href: string | null
  section_id: string | null
  duration_ms: number | null
  visitor_key: string | null
  session_id?: string | null
  user_agent?: string | null
  ip_city?: string | null
  ip_region?: string | null
  ip_country?: string | null
  created_at: string
}

type AdminTab = 'overview' | 'visitors' | 'siteChat' | 'contact' | 'visits' | 'events'

type VisitorProfile = {
  key: string
  name: string | null
  email: string | null
  phone: string | null
  city: string | null
  region: string | null
  country: string | null
  firstSeen: string
  lastSeen: string
  visits: VisitRow[]
  contacts: ContactRow[]
  chats: SiteChatRow[]
  events: AnalyticsEventRow[]
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [visits, setVisits] = useState<VisitRow[]>([])
  const [siteChat, setSiteChat] = useState<SiteChatRow[]>([])
  const [events, setEvents] = useState<AnalyticsEventRow[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [tab, setTab] = useState<AdminTab>('overview')
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

      const [ctRes, vRes, chRes, evRes] = await Promise.all([
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(500),
        supabase.from('page_visits').select('*').order('created_at', { ascending: false }).limit(1200),
        supabase.from('site_chat_log').select('*').order('created_at', { ascending: false }).limit(800),
        supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(2000),
      ])
      if (cancelled) return

      const blockingErrors = [ctRes.error?.message, vRes.error?.message, chRes.error?.message].filter(Boolean)
      if (blockingErrors.length) {
        setLoadError(blockingErrors.join(' · '))
        return
      }
      if (evRes.error) setLoadError(`Analytics events unavailable: ${evRes.error.message}. Run the latest Supabase migration.`)
      setContacts((ctRes.data ?? []) as ContactRow[])
      setVisits((vRes.data ?? []) as VisitRow[])
      setSiteChat((chRes.data ?? []) as SiteChatRow[])
      setEvents((evRes.data ?? []) as AnalyticsEventRow[])
    })()
    return () => {
      cancelled = true
    }
  }, [navigate])

  const visitorProfiles = useMemo(() => buildVisitorProfiles(visits, contacts, siteChat, events), [visits, contacts, siteChat, events])
  const uniqueVisitors = visitorProfiles.length
  const knownVisitors = visitorProfiles.filter((v) => v.contacts.length > 0).length
  const chatVisitors = new Set(siteChat.map((c) => c.visitor_key).filter(Boolean)).size
  const totalClicks = events.filter((e) => e.event_type === 'click').length
  const pageTime = events.filter((e) => e.event_type === 'page_time' && e.duration_ms)
  const avgPageTime = pageTime.length ? pageTime.reduce((sum, e) => sum + (e.duration_ms ?? 0), 0) / pageTime.length : 0
  const topPages = useMemo(() => topCounts(visits.map((v) => v.path), 5), [visits])
  const topClicks = useMemo(() => topCounts(events.filter((e) => e.event_type === 'click').map((e) => e.target_label || e.target_href || 'Unknown'), 5), [events])
  const topSections = useMemo(
    () => topDurations(events.filter((e) => e.event_type === 'section_time' && e.section_id)),
    [events],
  )
  const topLocations = useMemo(
    () => topCounts(visits.map((v) => locationLabel(v)).filter((v): v is string => Boolean(v)), 5),
    [visits],
  )

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
    <div className="admin-app admin-app--redesign">
      <header className="admin-header admin-header--dashboard">
        <div className="admin-header-inner">
          <div>
            <p className="admin-kicker">Eyedeal intelligence</p>
            <h1 className="admin-header-title">Admin dashboard</h1>
          </div>
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

      <main className="admin-main admin-main--dashboard">
        {loadError && <p className="admin-banner">{loadError}</p>}

        <section className="admin-hero-panel" aria-label="Dashboard summary">
          <div>
            <span className="admin-eyebrow">Live site activity</span>
            <h2>Know who visited, what they clicked, and which visitors reached out.</h2>
            <p>
              Contacts, chat questions, visits, click behavior, section dwell time, and approximate location are stitched together by visitor ID when available.
            </p>
          </div>
          <div className="admin-signal-list" aria-label="Top signals">
            <span>{uniqueVisitors} unique visitors</span>
            <span>{knownVisitors} identified by contact form</span>
            <span>{chatVisitors} used chat</span>
          </div>
        </section>

        <section className="admin-overview admin-overview--rich" aria-label="Key metrics">
          <Metric label="Unique visitors" value={uniqueVisitors} note={`${visits.length} tracked page visits`} />
          <Metric label="Identified visitors" value={knownVisitors} note="Submitted name/email in contact form" />
          <Metric label="Chat messages" value={siteChat.length} note={`${chatVisitors} unique chat visitors`} />
          <Metric label="Clicks tracked" value={totalClicks} note="Buttons, links, fields, and CTAs" />
          <Metric
            label="Avg page time"
            value={pageTime.length ? formatDuration(avgPageTime) : '—'}
            note={`${pageTime.length} measured page sessions`}
          />
          <Metric label="Contact conversion" value={pct(knownVisitors, Math.max(uniqueVisitors, 1))} note={`${contacts.length} contact messages`} />
        </section>

        <nav className="admin-tabs admin-tabs--dashboard" aria-label="Data sections">
          {[
            ['overview', 'Overview'],
            ['visitors', `Visitors (${uniqueVisitors})`],
            ['siteChat', `Chat (${siteChat.length})`],
            ['contact', `Contacts (${contacts.length})`],
            ['visits', `Visits (${visits.length})`],
            ['events', `Events (${events.length})`],
          ].map(([id, label]) => (
            <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id as AdminTab)}>
              {label}
            </button>
          ))}
        </nav>

        {tab === 'overview' && (
          <div className="admin-dashboard-grid">
            <InsightCard title="Top pages" rows={topPages} empty="No pages tracked yet." />
            <InsightCard title="Most clicked" rows={topClicks} empty="No clicks tracked yet." />
            <InsightCard title="Most time spent" rows={topSections} empty="Section time appears after visitors scroll." formatter={formatDuration} />
            <InsightCard title="Approx. locations" rows={topLocations} empty="Location appears after IP lookup succeeds." />
          </div>
        )}

        {tab === 'visitors' && (
          <section className="admin-panel">
            <SectionTitle title="Visitor profiles" text="Each profile links visits, clicks, chats, and contact submissions using the browser visitor ID." />
            <div className="visitor-grid">
              {visitorProfiles.length === 0 ? <EmptyState text="No visitor profiles yet." /> : null}
              {visitorProfiles.map((v) => (
                <article key={v.key} className="visitor-card">
                  <div className="visitor-card__top">
                    <div>
                      <span className="admin-pill">{v.name ? 'Identified' : 'Anonymous'}</span>
                      <h3>{v.name || shortId(v.key)}</h3>
                    </div>
                    <span className="visitor-card__id" title={v.key}>
                      {shortId(v.key)}
                    </span>
                  </div>
                  <p className="visitor-card__meta">{[v.email, v.phone, [v.city, v.region].filter(Boolean).join(', ')].filter(Boolean).join(' · ') || 'No contact or city yet'}</p>
                  <div className="visitor-card__stats">
                    <span><strong>{v.visits.length}</strong> visits</span>
                    <span><strong>{v.events.filter((e) => e.event_type === 'click').length}</strong> clicks</span>
                    <span><strong>{v.chats.length}</strong> chats</span>
                    <span><strong>{v.contacts.length}</strong> forms</span>
                  </div>
                  <p className="visitor-card__trail">Last seen {formatDt(v.lastSeen)} on {v.visits[0]?.path || v.events[0]?.path || 'site'}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'siteChat' && (
          <section className="admin-panel">
            <div className="admin-panel-head">
              <SectionTitle title="Site chat log" text="Readable conversations with visitor, page, topic, and approximate location attached when available." />
              <label className="admin-chat-sort">
                <span>Sort</span>
                <select value={chatSort} onChange={(e) => setChatSort(e.target.value as 'newest' | 'oldest')} className="admin-select">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </label>
            </div>
            <div className="chat-log-list">
              {siteChatSorted.length === 0 ? <EmptyState text="No site chat yet." /> : null}
              {siteChatSorted.map((c) => (
                <article key={c.id} className="chat-log-card">
                  <div className="chat-log-card__rail">
                    <span className="admin-pill">{siteChatLabel(c.category)}</span>
                    <time>{formatDt(c.created_at)}</time>
                  </div>
                  <div className="chat-log-card__body">
                    <div className="chat-message-pair">
                      <div>
                        <span>Visitor asked</span>
                        <p>{c.user_message}</p>
                      </div>
                      <div>
                        <span>Auto reply</span>
                        <p>{c.assistant_reply}</p>
                      </div>
                    </div>
                    <div className="admin-log-meta">
                      <span>Page {c.path || '—'}</span>
                      <span>Visitor {c.visitor_key ? shortId(c.visitor_key) : '—'}</span>
                      <span>{locationLabel(c) || 'Location pending'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'contact' && (
          <section className="admin-panel">
            <SectionTitle title="Contact inbox" text="People who submitted a name are tied back to their visitor activity, chat logs, and visit source when available." />
            <div className="contact-inbox-list">
              {contacts.length === 0 ? <EmptyState text="No messages yet." /> : null}
              {contacts.map((c) => (
                <article key={c.id} className="contact-inbox-card">
                  <div>
                    <span className="admin-pill">{c.source || 'contact'}</span>
                    <h3>{c.name}</h3>
                    <p>{[c.email, c.phone].filter(Boolean).join(' · ')}</p>
                  </div>
                  <div className="contact-inbox-card__message">{c.message}</div>
                  <div className="admin-log-meta">
                    <span>{formatDt(c.created_at)}</span>
                    <span>{c.page_path || 'Unknown page'}</span>
                    <span>{c.visitor_key ? `Visitor ${shortId(c.visitor_key)}` : 'No visitor ID'}</span>
                    <span>{locationLabel(c) || 'Location pending'}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'visits' && (
          <section className="admin-panel">
            <SectionTitle title="Visits log" text="Recent page loads with referrer, device, and approximate IP location when the lookup succeeds." />
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Path</th>
                    <th>Visitor</th>
                    <th>Location</th>
                    <th>Referrer</th>
                    <th>Device</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.length === 0 ? (
                    <tr><td colSpan={6} className="admin-empty">No visits logged yet.</td></tr>
                  ) : visits.map((v) => (
                    <tr key={v.id}>
                      <td>{formatDt(v.created_at)}</td>
                      <td>{v.path}</td>
                      <td title={v.visitor_key ?? ''}>{v.visitor_key ? shortId(v.visitor_key) : '—'}</td>
                      <td>{locationLabel(v) || '—'}</td>
                      <td className="admin-cell-notes">{v.referrer || 'Direct / unknown'}</td>
                      <td className="admin-cell-notes">{shortUa(v.user_agent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'events' && (
          <section className="admin-panel">
            <SectionTitle title="Interaction events" text="Raw clicks, section views, page time, and section dwell events used by the summary metrics." />
            <div className="event-stream">
              {events.length === 0 ? <EmptyState text="No interaction events yet. Run the migration and browse the public site." /> : null}
              {events.slice(0, 180).map((e) => (
                <article key={e.id} className="event-row">
                  <span className="event-type">{eventLabel(e)}</span>
                  <strong>{e.target_label || e.section_id || e.path}</strong>
                  <span>{formatDt(e.created_at)}</span>
                  <span>{e.duration_ms ? formatDuration(e.duration_ms) : e.path}</span>
                  <span>{e.visitor_key ? shortId(e.visitor_key) : '—'}</span>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function Metric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <article className="admin-stat-card">
      <span className="admin-stat-label">{label}</span>
      <strong className="admin-stat-value">{value}</strong>
      <p>{note}</p>
    </article>
  )
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="admin-section-copy admin-section-copy--large">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

function InsightCard({
  title,
  rows,
  empty,
  formatter,
}: {
  title: string
  rows: { label: string; value: number }[]
  empty: string
  formatter?: (n: number) => string
}) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <article className="admin-insight-card">
      <h3>{title}</h3>
      {rows.length === 0 ? <p className="admin-empty-note">{empty}</p> : null}
      {rows.map((row) => (
        <div key={row.label} className="insight-row">
          <div className="insight-row__meta">
            <span className="insight-row__label" title={row.label}>
              {row.label}
            </span>
            <strong className="insight-row__count">{formatter ? formatter(row.value) : row.value}</strong>
          </div>
          <div className="insight-row__track" aria-hidden>
            <span
              className="insight-row__bar"
              style={{ transform: `scaleX(${Math.max(row.value / max, 0.04)})` }}
            />
          </div>
        </div>
      ))}
    </article>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="admin-empty-state">{text}</p>
}

function buildVisitorProfiles(visits: VisitRow[], contacts: ContactRow[], chats: SiteChatRow[], events: AnalyticsEventRow[]) {
  const profiles = new Map<string, VisitorProfile>()
  const ensure = (key: string) => {
    if (!profiles.has(key)) {
      profiles.set(key, {
        key,
        name: null,
        email: null,
        phone: null,
        city: null,
        region: null,
        country: null,
        firstSeen: new Date().toISOString(),
        lastSeen: '1970-01-01T00:00:00.000Z',
        visits: [],
        contacts: [],
        chats: [],
        events: [],
      })
    }
    return profiles.get(key)!
  }

  const touch = (
    profile: VisitorProfile,
    createdAt: string,
    row: { ip_city?: string | null; ip_region?: string | null; ip_country?: string | null },
  ) => {
    if (new Date(createdAt) < new Date(profile.firstSeen)) profile.firstSeen = createdAt
    if (new Date(createdAt) > new Date(profile.lastSeen)) profile.lastSeen = createdAt
    profile.city ||= row.ip_city || null
    profile.region ||= row.ip_region || null
    profile.country ||= row.ip_country || null
  }

  for (const v of visits) {
    if (!v.visitor_key) continue
    const profile = ensure(v.visitor_key)
    profile.visits.push(v)
    touch(profile, v.created_at, v)
  }
  for (const c of contacts) {
    const key = c.visitor_key || `contact:${c.id}`
    const profile = ensure(key)
    profile.contacts.push(c)
    profile.name ||= c.name
    profile.email ||= c.email
    profile.phone ||= c.phone
    touch(profile, c.created_at, c)
  }
  for (const c of chats) {
    if (!c.visitor_key) continue
    const profile = ensure(c.visitor_key)
    profile.chats.push(c)
    touch(profile, c.created_at, c)
  }
  for (const e of events) {
    if (!e.visitor_key) continue
    const profile = ensure(e.visitor_key)
    profile.events.push(e)
    touch(profile, e.created_at, e)
  }

  return [...profiles.values()].sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
}

function topCounts(values: string[], limit: number) {
  const counts = new Map<string, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
}

function topDurations(rows: AnalyticsEventRow[]) {
  const counts = new Map<string, number>()
  for (const row of rows) counts.set(row.section_id || 'Unknown', (counts.get(row.section_id || 'Unknown') ?? 0) + (row.duration_ms ?? 0))
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
}

function formatDt(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return iso
  }
}

function formatDuration(ms: number) {
  if (ms <= 0 || Number.isNaN(ms)) return '0 sec'
  const sec = Math.round(ms / 1000)
  if (sec < 60) return `${sec} sec`
  const min = Math.floor(sec / 60)
  return `${min} min ${sec % 60}s`
}

function pct(value: number, total: number) {
  return `${Math.round((value / total) * 100)}%`
}

function shortId(s: string) {
  return s.length > 10 ? `${s.slice(0, 6)}…${s.slice(-3)}` : s
}

function shortUa(ua: string | null | undefined) {
  if (!ua) return '—'
  return ua.length > 86 ? `${ua.slice(0, 86)}…` : ua
}

function locationLabel(row: { ip_city?: string | null; ip_region?: string | null; ip_country?: string | null }) {
  return [row.ip_city, row.ip_region || row.ip_country].filter(Boolean).join(', ')
}

function eventLabel(e: AnalyticsEventRow) {
  if (e.event_type === 'page_time') return 'Page time'
  if (e.event_type === 'section_time') return 'Section time'
  if (e.event_type === 'section_view') return 'Section view'
  return 'Click'
}
