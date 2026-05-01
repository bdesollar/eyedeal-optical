import { Link } from 'react-router-dom'
import BrandLogoLink from '../BrandLogoLink'
import { SITE_LINKS } from '../../lib/siteLinks'
import CallOrContactLink from '../CallOrContactLink'

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <BrandLogoLink variant="footer" />
            <p>Dubuque's locally owned, hand-curated boutique optical studio. Fitting friends and neighbors with exceptional eyewear since 1997.</p>
            <div className="socials">
              <a href={SITE_LINKS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook (search)">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v8h4v-8h3l1-4h-4V9z" />
                </svg>
              </a>
              <a href={SITE_LINKS.instagram} target="_blank" rel="noreferrer" aria-label="Instagram (search)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a href={SITE_LINKS.maps} target="_blank" rel="noreferrer" aria-label="Open in Google Maps">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h6>Studio</h6>
            <a href="#story">Our Story</a>
            <a href="#services">Services</a>
            <a href="#designers">Designers</a>
            <a href="#lens">Lens Technology</a>
            <a href="#health">Eye Health</a>
          </div>

          <div className="foot-col">
            <h6>Contact</h6>
            <p>2644 Pennsylvania Ave.<br />Dubuque, IA 52001</p>
            <CallOrContactLink>563.557.0995</CallOrContactLink>
            <a href="mailto:eyedealoptical1997@yahoo.com">eyedealoptical1997@yahoo.com</a>
            <Link to="/#contact" style={{ display: 'block', marginTop: 10, fontSize: 13, color: 'var(--brass)' }}>
              Hours &amp; how to visit
            </Link>
          </div>

          <div className="foot-col">
            <h6>Hours</h6>
            <p>Mon–Fri &nbsp; 9:00 — 5:00</p>
            <p>Saturday &nbsp; 9:00 — 12:00</p>
            <p>Sunday &nbsp; Closed</p>
          </div>
        </div>

        <div className="foot-bot">
          <span>© {new Date().getFullYear()} Eyedeal Optical · Owned &amp; operated by Bob Pierce</span>
          <span className="since">
            <em>Crafting Dubuque's eyewear since 1997.</em>
            <Link to="/admin/login" className="admin-foot-link" aria-label="Staff sign in">
              Staff
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
