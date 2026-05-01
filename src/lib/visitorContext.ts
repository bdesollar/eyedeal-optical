const VISITOR_KEY = 'eyedeal_visitor_id'
const SESSION_KEY = 'eyedeal_session_id'
const GEO_KEY = 'eyedeal_geo_context_v1'
const GEO_TTL = 1000 * 60 * 60 * 12

export type GeoContext = {
  ip_address: string | null
  ip_city: string | null
  ip_region: string | null
  ip_country: string | null
  ip_org: string | null
}

export type VisitorContext = GeoContext & {
  visitor_key: string | null
  session_id: string | null
  user_agent: string | null
  screen_width: number | null
  screen_height: number | null
  language: string | null
  timezone: string | null
}

const emptyGeo: GeoContext = {
  ip_address: null,
  ip_city: null,
  ip_region: null,
  ip_country: null,
  ip_org: null,
}

function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readStorage(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export function getOrCreateVisitorKey(): string | null {
  let id = readStorage(VISITOR_KEY)
  if (!id) {
    id = uuid()
    writeStorage(VISITOR_KEY, id)
  }
  return id
}

export function getOrCreateSessionId(): string | null {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = uuid()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return null
  }
}

function baseContext(): VisitorContext {
  return {
    visitor_key: getOrCreateVisitorKey(),
    session_id: getOrCreateSessionId(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    screen_width: typeof window !== 'undefined' ? window.innerWidth : null,
    screen_height: typeof window !== 'undefined' ? window.innerHeight : null,
    language: typeof navigator !== 'undefined' ? navigator.language : null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    ...emptyGeo,
  }
}

function readCachedGeo(): GeoContext | null {
  try {
    const raw = localStorage.getItem(GEO_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { savedAt: number; geo: GeoContext }
    if (!parsed.savedAt || Date.now() - parsed.savedAt > GEO_TTL) return null
    return parsed.geo
  } catch {
    return null
  }
}

function cacheGeo(geo: GeoContext) {
  try {
    localStorage.setItem(GEO_KEY, JSON.stringify({ savedAt: Date.now(), geo }))
  } catch {
    /* ignore */
  }
}

export async function getVisitorContext(options: { withGeo?: boolean } = {}): Promise<VisitorContext> {
  const base = baseContext()
  if (!options.withGeo) return base

  const cached = readCachedGeo()
  if (cached) return { ...base, ...cached }

  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 1600)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    window.clearTimeout(timeout)
    if (!res.ok) return base
    const data = await res.json()
    const geo: GeoContext = {
      ip_address: data.ip || null,
      ip_city: data.city || null,
      ip_region: data.region || null,
      ip_country: data.country_name || data.country || null,
      ip_org: data.org || data.asn || null,
    }
    cacheGeo(geo)
    return { ...base, ...geo }
  } catch {
    return base
  }
}

export function getCurrentVisitorContext(): VisitorContext {
  return baseContext()
}
