import { useEffect, useRef } from 'react'

const brands = ['Ray-Ban','Oakley','Maui Jim','Tom Ford','Persol','Costa','Silhouette','Kate Spade','Coach','Nike Vision']

const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export default function HeroSection() {
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = visualRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.querySelectorAll<HTMLElement>('.hero-frame').forEach((f, i) => {
        const k = (i + 1) * 4
        f.style.translate = `${x * k}px ${y * k}px`
      })
    }

    const handleMouseLeave = () => {
      el.querySelectorAll<HTMLElement>('.hero-frame').forEach((f) => {
        f.style.translate = '0 0'
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          {/* Left: text */}
          <div className="hero-text">
            <div className="hero-eyebrow reveal">
              <span className="line" />
              <span className="eyebrow">Boutique Optical Studio · Est. 1997</span>
            </div>
            <h1 className="reveal delay-1">
              Fitting <em>friends</em><br />
              and neighbors<br />
              with <span className="scriptish">exceptional</span><br />
              eyewear.
            </h1>
            <p className="hero-sub reveal delay-2">
              A locally owned, hand-curated eyewear studio in the heart of Dubuque. Every frame personally selected by Bob Pierce. Every lens cut on the premises.
            </p>
            <div className="hero-ctas reveal delay-3">
              <a href="#contact" className="btn btn-primary">
                Book an Appointment
                <ArrowRight />
              </a>
              <a href="#designers" className="btn btn-ghost">Browse the Collection</a>
            </div>
            <div className="hero-meta reveal delay-3">
              <div className="item">
                <div className="num"><em>29</em>yrs</div>
                <div className="lbl">Serving Dubuque</div>
              </div>
              <div className="item">
                <div className="num">100<em>%</em></div>
                <div className="lbl">Lenses cut on-site</div>
              </div>
              <div className="item">
                <div className="num">1yr<em>+</em></div>
                <div className="lbl">Frame &amp; lens warranty</div>
              </div>
            </div>
          </div>

          {/* Right: visual */}
          <div className="hero-visual reveal delay-2" ref={visualRef}>
            <div className="stage">
              {/* Spinning stamp */}
              <div className="hero-stamp">
                <svg viewBox="0 0 120 120" width="120" height="120">
                  <defs>
                    <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                  </defs>
                  <text fontFamily="Cormorant Garamond" fontSize="10" letterSpacing="3" fill="#C9A961">
                    <textPath href="#circ">HAND-PICKED · LOCALLY-CRAFTED · SINCE 1997 · </textPath>
                  </text>
                  <circle cx="60" cy="60" r="34" fill="none" stroke="#C9A961" strokeWidth=".5" opacity=".5" />
                  <text x="60" y="58" textAnchor="middle" fontFamily="Italiana" fontSize="11" fill="#F5EDE0" letterSpacing="2">EYEDEAL</text>
                  <text x="60" y="72" textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="9" fill="#C9A961">studio</text>
                </svg>
              </div>

              {/* Main frame f1 */}
              <svg className="hero-frame f1" viewBox="0 0 380 130" fill="none">
                <ellipse cx="80" cy="65" rx="68" ry="55" stroke="#F5EDE0" strokeWidth="3" fill="rgba(15,26,46,0.4)" />
                <ellipse cx="300" cy="65" rx="68" ry="55" stroke="#F5EDE0" strokeWidth="3" fill="rgba(15,26,46,0.4)" />
                <path d="M148 60 Q190 44 232 60" stroke="#F5EDE0" strokeWidth="3" fill="none" />
                <path d="M12 65 L0 50" stroke="#F5EDE0" strokeWidth="3" />
                <path d="M368 65 L380 50" stroke="#F5EDE0" strokeWidth="3" />
                <ellipse cx="80" cy="65" rx="60" ry="48" fill="none" stroke="#C9A961" strokeWidth=".5" opacity=".4" />
                <ellipse cx="300" cy="65" rx="60" ry="48" fill="none" stroke="#C9A961" strokeWidth=".5" opacity=".4" />
              </svg>

              {/* Aviator f2 */}
              <svg className="hero-frame f2" viewBox="0 0 320 120" fill="none">
                <path d="M40 30 L130 30 L120 90 Q80 100 60 90 L40 30Z" stroke="#C9A961" strokeWidth="2.5" fill="rgba(201,169,97,0.15)" />
                <path d="M190 30 L280 30 L260 90 Q220 100 200 90 L190 30Z" stroke="#C9A961" strokeWidth="2.5" fill="rgba(201,169,97,0.15)" />
                <path d="M130 35 L190 35" stroke="#C9A961" strokeWidth="2.5" />
                <line x1="40" y1="30" x2="20" y2="20" stroke="#C9A961" strokeWidth="2.5" />
                <line x1="280" y1="30" x2="300" y2="20" stroke="#C9A961" strokeWidth="2.5" />
              </svg>

              {/* Round f3 */}
              <svg className="hero-frame f3" viewBox="0 0 320 120" fill="none">
                <circle cx="80" cy="60" r="46" stroke="#F5EDE0" strokeWidth="2.5" fill="rgba(245,237,224,0.06)" />
                <circle cx="240" cy="60" r="46" stroke="#F5EDE0" strokeWidth="2.5" fill="rgba(245,237,224,0.06)" />
                <path d="M126 58 L194 58" stroke="#F5EDE0" strokeWidth="2.5" />
                <line x1="34" y1="60" x2="20" y2="50" stroke="#F5EDE0" strokeWidth="2.5" />
                <line x1="286" y1="60" x2="300" y2="50" stroke="#F5EDE0" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="hero-marquee">
        <div className="marquee-track">
          {[...brands, ...brands].map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
