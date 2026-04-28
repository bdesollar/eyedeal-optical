import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const navAnchors: { href: string; label: string }[] = [
  { href: '#story', label: 'Our Story' },
  { href: '#services', label: 'Services' },
  { href: '#designers', label: 'Designers' },
  { href: '#lens', label: 'Lens Technology' },
  { href: '#health', label: 'Eye Health' },
  { href: '#contact', label: 'Visit Us' },
]

const SAME_PAGE_HASH_DELAY_MS = 220

export default function SiteNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [portalReady, setPortalReady] = useState(false)
  const panelId = useId()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const samePageHashNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useEffect(
    () => () => {
      if (samePageHashNavTimerRef.current) {
        clearTimeout(samePageHashNavTimerRef.current)
        samePageHashNavTimerRef.current = null
      }
    },
    [],
  )

  const close = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('nav-menu-open')
      document.documentElement.classList.add('nav-menu-open')
      const t = window.setTimeout(() => firstLinkRef.current?.focus(), 10)
      return () => {
        document.body.classList.remove('nav-menu-open')
        document.documentElement.classList.remove('nav-menu-open')
        window.clearTimeout(t)
        burgerRef.current?.focus()
      }
    }
    document.body.classList.remove('nav-menu-open')
    document.documentElement.classList.remove('nav-menu-open')
  }, [menuOpen])

  const ariaMenuExpanded: 'true' | 'false' = menuOpen ? 'true' : 'false'

  useEffect(() => {
    const mq = window.matchMedia('(min-width:1081px)')
    const closeIfWide = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', closeIfWide)
    return () => mq.removeEventListener('change', closeIfWide)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuOpen) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, close])

  function onNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    if (!href.startsWith('#') || href === '#') return
    const id = href.slice(1)
    if (!id) return

    close()

    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: id }, { preventScrollReset: true })
      return
    }

    if (samePageHashNavTimerRef.current) {
      clearTimeout(samePageHashNavTimerRef.current)
    }
    samePageHashNavTimerRef.current = window.setTimeout(() => {
      samePageHashNavTimerRef.current = null
      const hashBefore = window.location.hash
      navigate({ hash: id }, { preventScrollReset: true })
      // Re-tapping the same #section does not change `location` — Home will not re-scroll; handle here.
      if (hashBefore === `#${id}`) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, SAME_PAGE_HASH_DELAY_MS)
  }

  return (
    <nav className="nav" aria-label="Main">
      <div className="wrap">
        <div className="row">
          <Link to="/" className="logo" onClick={close}>
            <span className="logo-mark">
              <svg viewBox="0 0 84 32" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <circle cx="20" cy="16" r="13" stroke="#0F1A2E" />
                <circle cx="64" cy="16" r="13" stroke="#0F1A2E" />
                <path d="M33 16h18" stroke="#C9A961" strokeWidth="1.6" />
                <circle cx="20" cy="16" r="3" fill="#C9A961" stroke="none" />
                <circle cx="64" cy="16" r="3" fill="#C9A961" stroke="none" />
              </svg>
            </span>
            <span className="logo-text">Eyedeal <em>Optical</em></span>
          </Link>

          <div className="navlinks" aria-label="In-page">
            {navAnchors.map(({ href, label }) => (
              <a key={href} href={href} onClick={(e) => onNavClick(e, href)}>
                {label}
              </a>
            ))}
          </div>

          <div className="nav-right">
            <Link to="/book" className="btn btn-primary" onClick={close}>
              <span className="nav-cta-text">Book appointment</span>
              <span className="nav-cta-text-short" aria-hidden>
                Book
              </span>
              <ArrowRight />
            </Link>
            <button
              ref={burgerRef}
              type="button"
              className="nav-burger"
              id={`${panelId}-burger`}
              aria-expanded={ariaMenuExpanded}
              aria-controls={panelId}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="nav-burger-lines" aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span className="visually-hidden">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {portalReady &&
        createPortal(
          <>
            <div
              className="nav-overlay"
              data-open={menuOpen}
              onClick={close}
              onKeyDown={(e) => e.key === 'Escape' && close()}
              aria-hidden
            />
            <div
              className={`nav-panel${menuOpen ? ' is-open' : ''}`}
              id={panelId}
              role="dialog"
              aria-label="Site sections"
              aria-modal="true"
              aria-hidden={!menuOpen}
            >
              <div className="nav-panel-head">
                <span className="nav-panel-title">On this page</span>
                <button type="button" className="nav-panel-close" onClick={close} aria-label="Close menu">
                  ×
                </button>
              </div>
              <ul className="nav-panel-list">
                {navAnchors.map(({ href, label }, i) => (
                  <li key={href}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={href}
                      onClick={(e) => onNavClick(e, href)}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="nav-panel-cta">
                <Link to="/book" className="btn btn-primary nav-panel-cta-btn" onClick={close}>
                  Book appointment
                  <ArrowRight />
                </Link>
                <a href="#contact" className="nav-panel-secondary" onClick={(e) => onNavClick(e, '#contact')}>
                  Or send a message
                </a>
              </div>
            </div>
          </>,
          document.body,
        )}
    </nav>
  )
}
