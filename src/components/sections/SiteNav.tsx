const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export default function SiteNav() {
  return (
    <nav className="nav">
      <div className="wrap">
        <div className="row">
          <a href="#" className="logo">
            <span className="logo-mark">
              <svg viewBox="0 0 84 32" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="20" cy="16" r="13" stroke="#0F1A2E" />
                <circle cx="64" cy="16" r="13" stroke="#0F1A2E" />
                <path d="M33 16h18" stroke="#C9A961" strokeWidth="1.6" />
                <circle cx="20" cy="16" r="3" fill="#C9A961" stroke="none" />
                <circle cx="64" cy="16" r="3" fill="#C9A961" stroke="none" />
              </svg>
            </span>
            <span className="logo-text">Eyedeal <em>Optical</em></span>
          </a>

          <div className="navlinks">
            <a href="#story">Our Story</a>
            <a href="#services">Services</a>
            <a href="#designers">Designers</a>
            <a href="#lens">Lens Technology</a>
            <a href="#health">Eye Health</a>
            <a href="#contact">Visit Us</a>
          </div>

          <div className="nav-right">
            <span className="nav-phone">Call <strong>563.557.0995</strong></span>
            <a href="#contact" className="btn btn-primary">
              Book Appointment
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
