import { Link } from 'react-router-dom'
import PublicPageShell from '../components/PublicPageShell'
import { SITE_LINKS } from '../lib/siteLinks'

export default function BookAppointment() {
  return (
    <PublicPageShell>
      <div className="book-page">
        <header className="book-header">
          <span className="eyebrow">Visit the studio</span>
          <h1 className="book-title">Plan your visit</h1>
          <p className="book-lead">
            We&apos;re a small, locally owned boutique — we don&apos;t offer online scheduling or reserved one-on-one styling appointments.
            It&apos;s common to have just one of us in the shop, so we can&apos;t always guarantee individual attention for walk-ins. The best
            way to reach us is a quick call or a message through the form on the home page.
          </p>
        </header>

        <div className="book-static-grid">
          <div className="book-static-card">
            <h2 className="book-h2">Call</h2>
            <p className="book-lead" style={{ marginBottom: 0 }}>
              <a href={SITE_LINKS.studioTelHref} style={{ color: 'var(--navy)', fontWeight: 600 }}>
                {SITE_LINKS.studioPhoneDisplay}
              </a>
            </p>
            <p className="book-hint" style={{ marginTop: 12 }}>
              Monday–Friday 9–5 · Saturday 9–12 · Sunday closed
            </p>
          </div>

          <div className="book-static-card">
            <h2 className="book-h2">Visit</h2>
            <p className="book-lead" style={{ marginBottom: 0 }}>
              2644 Pennsylvania Ave.
              <br />
              Dubuque, IA 52001
            </p>
            <p className="book-hint" style={{ marginTop: 12 }}>
              <a href="https://www.google.com/maps/search/?api=1&query=Eyedeal+Optical+2644+Pennsylvania+Ave+Dubuque+IA+52001" target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </p>
          </div>

          <div className="book-static-card book-static-card--wide">
            <h2 className="book-h2">Message us</h2>
            <p className="book-lead" style={{ marginBottom: 0 }}>
              Use <strong>Visit Us</strong> on the home page to send a note — exams, contacts, adjustments, or general questions. We&apos;ll
              follow up by phone or email.
            </p>
            <p className="book-hint" style={{ marginTop: 16 }}>
              <Link to="/#contact" style={{ color: 'var(--brass-deep)', fontWeight: 600 }}>
                Go to contact form →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}
