import { Link } from 'react-router-dom'
import PublicPageShell from '../components/PublicPageShell'
import { SITE_LINKS } from '../lib/siteLinks'
import CallOrContactLink from '../components/CallOrContactLink'

const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export default function BookAppointment() {
  return (
    <PublicPageShell>
      <main className="visit-page" id="visit-main">
        <div className="wrap visit-page__inner">
          <nav className="visit-breadcrumb" aria-label="Breadcrumb">
            <ol className="visit-breadcrumb__list">
              <li>
                <Link to="/" className="visit-breadcrumb__link">
                  Home
                </Link>
              </li>
              <li className="visit-breadcrumb__sep" aria-hidden>
                /
              </li>
              <li className="visit-breadcrumb__current" aria-current="page">
                Plan your visit
              </li>
            </ol>
          </nav>

          <header className="visit-hero">
            <span className="eyebrow">Visit the studio</span>
            <h1 className="visit-title">
              Plan your <em>visit</em>
            </h1>
            <p className="visit-intro">
              We&apos;re a small, locally owned boutique — we don&apos;t offer online scheduling or reserved one-on-one styling appointments.
              It&apos;s common to have just one of us in the shop, so we can&apos;t always guarantee individual attention for walk-ins. The best
              way to reach us is a quick call or a message through the form on the home page.
            </p>
          </header>

          <ul className="visit-cards">
            <li className="visit-card">
              <h2 className="visit-card__label">Call</h2>
              <CallOrContactLink className="visit-card__tel">
                {SITE_LINKS.studioPhoneDisplay}
              </CallOrContactLink>
              <p className="visit-card__meta">Monday–Friday 9–5 · Saturday 9–12 · Sunday closed</p>
            </li>
            <li className="visit-card">
              <h2 className="visit-card__label">Visit</h2>
              <p className="visit-card__address">
                2644 Pennsylvania Ave.
                <br />
                Dubuque, IA 52001
              </p>
              <a href={SITE_LINKS.maps} className="visit-card__link" target="_blank" rel="noreferrer">
                Open in Google Maps
                <ArrowRight />
              </a>
            </li>
            <li className="visit-card visit-card--wide">
              <h2 className="visit-card__label">Message us</h2>
              <p className="visit-card__body">
                Use <strong>Visit Us</strong> on the home page to send a note — exams, contacts, adjustments, or general questions. We&apos;ll
                follow up by phone or email.
              </p>
              <Link to="/#contact" className="btn btn-gold visit-card__cta">
                Go to contact form
                <ArrowRight />
              </Link>
            </li>
          </ul>

          <div className="visit-actions">
            <CallOrContactLink className="btn btn-primary">
              Call the studio
              <ArrowRight />
            </CallOrContactLink>
            <Link to="/#contact" className="btn btn-ghost visit-actions__secondary">
              Send a message
            </Link>
          </div>
        </div>
      </main>
    </PublicPageShell>
  )
}
