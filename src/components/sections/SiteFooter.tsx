import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Link to="/" className="logo">
              <span className="logo-mark">
                <svg viewBox="0 0 84 32" fill="none" strokeWidth="1.4" aria-hidden>
                  <circle cx="20" cy="16" r="13" stroke="#F5EDE0" />
                  <circle cx="64" cy="16" r="13" stroke="#F5EDE0" />
                  <path d="M33 16h18" stroke="#C9A961" strokeWidth="1.6" />
                  <circle cx="20" cy="16" r="3" fill="#C9A961" />
                  <circle cx="64" cy="16" r="3" fill="#C9A961" />
                </svg>
              </span>
              <span className="logo-text">Eyedeal <em>Optical</em></span>
            </Link>
            <p>Dubuque's locally owned, hand-curated boutique optical studio. Fitting friends and neighbors with exceptional eyewear since 1997.</p>
            <div className="socials">
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v8h4v-8h3l1-4h-4V9z" /></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="Google">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 11v3h5c-.4 2-2.4 3.5-5 3.5-3 0-5.5-2.5-5.5-5.5S9 6.5 12 6.5c1.4 0 2.6.5 3.5 1.3l2.5-2.5C16.5 4 14.4 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.7-3.7 8.7-8.8 0-.6-.1-1.2-.2-1.7H12z" />
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
            <a href="tel:15635570995">563.557.0995</a>
            <a href="mailto:eyedealoptical1997@yahoo.com">eyedealoptical1997@yahoo.com</a>
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
