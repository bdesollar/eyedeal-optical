import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { logAnalyticsEvent, logPageVisit } from '../lib/api'
import { getOrCreateVisitorKey } from '../lib/visitorContext'

function readableTarget(el: HTMLElement) {
  const aria = el.getAttribute('aria-label')
  if (aria) return aria.trim()
  const text = el.innerText || el.textContent || ''
  return text.replace(/\s+/g, ' ').trim().slice(0, 120)
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

    const visitorKey = getOrCreateVisitorKey()
    void logPageVisit({
      path,
      referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      visitorKey,
    })
  }, [location.pathname, location.search])

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return

    const path = `${location.pathname}${location.search}` || '/'
    const startedAt = performance.now()
    let pageTimeLogged = false
    const sectionStarts = new Map<string, number>()
    const seenSections = new Set<string>()

    function flushPageTime() {
      if (pageTimeLogged) return
      pageTimeLogged = true
      const duration = performance.now() - startedAt
      if (duration > 1000) {
        void logAnalyticsEvent({ eventType: 'page_time', path, durationMs: duration })
      }
    }

    function flushOpenSections() {
      const now = performance.now()
      for (const [id, sectionStartedAt] of sectionStarts) {
        const duration = now - sectionStartedAt
        if (duration > 900) {
          void logAnalyticsEvent({ eventType: 'section_time', path, sectionId: id, durationMs: duration })
        }
      }
      sectionStarts.clear()
    }

    function onClick(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target.closest('a,button,[role="button"],input,select,textarea') : null
      if (!(target instanceof HTMLElement)) return
      const href = target instanceof HTMLAnchorElement ? target.href : null
      void logAnalyticsEvent({
        eventType: 'click',
        path,
        targetLabel: readableTarget(target) || target.tagName.toLowerCase(),
        targetHref: href,
        sectionId: target.closest('section[id]')?.id || null,
        metadata: {
          tag: target.tagName.toLowerCase(),
          className: target.className?.toString().slice(0, 180) || null,
        },
      })
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        flushOpenSections()
        flushPageTime()
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now()
        for (const entry of entries) {
          const id = entry.target.id
          if (!id) continue
          if (entry.isIntersecting) {
            sectionStarts.set(id, now)
            if (!seenSections.has(id)) {
              seenSections.add(id)
              void logAnalyticsEvent({ eventType: 'section_view', path, sectionId: id })
            }
          } else {
            const sectionStartedAt = sectionStarts.get(id)
            if (sectionStartedAt) {
              const duration = now - sectionStartedAt
              sectionStarts.delete(id)
              if (duration > 900) {
                void logAnalyticsEvent({ eventType: 'section_time', path, sectionId: id, durationMs: duration })
              }
            }
          }
        }
      },
      { threshold: 0.5 },
    )

    document.querySelectorAll('section[id], main[id]').forEach((el) => observer.observe(el))
    document.addEventListener('click', onClick, { capture: true })
    window.addEventListener('pagehide', flushPageTime)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      flushOpenSections()
      flushPageTime()
      document.removeEventListener('click', onClick, { capture: true })
      window.removeEventListener('pagehide', flushPageTime)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer.disconnect()
    }
  }, [location.pathname, location.search])

  return null
}
