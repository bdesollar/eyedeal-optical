import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { logPageVisit } from '../lib/api'

const STORAGE_KEY = 'eyedeal_visitor_id'

function getOrCreateVisitorKey(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(STORAGE_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

export default function VisitTracker() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return

    const path = `${location.pathname}${location.search}` || '/'
    const sessionKey = `eyedeal_visit:${path}`
    try {
      if (sessionStorage.getItem(sessionKey)) return
      sessionStorage.setItem(sessionKey, '1')
    } catch {
      /* ignore */
    }

    void logPageVisit({
      path,
      referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      visitorKey: getOrCreateVisitorKey() || null,
    })
  }, [location.pathname, location.search])

  return null
}
