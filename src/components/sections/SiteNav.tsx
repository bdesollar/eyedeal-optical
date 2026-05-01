import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import BrandLogoLink from '../BrandLogoLink'
import { SITE_LINKS } from '../../lib/siteLinks'
import CallOrContactLink from '../CallOrContactLink'

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
          <BrandLogoLink variant="nav" onClick={close} />

          <div className="navlinks" aria-label="In-page">
            {navAnchors.map(({ href, label }) => (
              <a key={href} href={href} onClick={(e) => onNavClick(e, href)}>
                {label}
              </a>
            ))}
          </div>

          <div className="nav-right">
            <div className="nav-cta-group">
              <CallOrContactLink
                className="btn btn-primary nav-cta-btn"
                title={`Call ${SITE_LINKS.studioPhoneDisplay}`}
                ariaLabel={`Call Eyedeal Optical at ${SITE_LINKS.studioPhoneDisplay}`}
                onClick={close}
              >
                <span className="nav-cta-text">Call us</span>
                <span className="nav-cta-text-short" aria-hidden>
                  Call
                </span>
                <ArrowRight />
              </CallOrContactLink>
              <a
                href="#contact"
                className="btn btn-ghost nav-cta-secondary nav-cta-btn"
                onClick={(e) => onNavClick(e, '#contact')}
              >
                <span className="nav-cta-text">Hours &amp; visit info</span>
                <span className="nav-cta-text-short" aria-hidden>
                  Info
                </span>
              </a>
            </div>
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
                <CallOrContactLink
                  className="btn btn-primary nav-panel-cta-btn"
                  title={`Call ${SITE_LINKS.studioPhoneDisplay}`}
                  ariaLabel={`Call Eyedeal Optical at ${SITE_LINKS.studioPhoneDisplay}`}
                  onClick={close}
                >
                  Call us
                  <ArrowRight />
                </CallOrContactLink>
                <a
                  href="#contact"
                  className="btn btn-ghost nav-panel-cta-btn nav-panel-cta-secondary"
                  onClick={(e) => onNavClick(e, '#contact')}
                >
                  Hours &amp; visit info
                </a>
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
