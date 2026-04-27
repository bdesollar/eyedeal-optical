const articles = [
  {
    meta: 'Vision Care · 4 min read',
    title: 'How often should you really get an eye exam?',
    desc: "The answer depends less on your age than on your habits — and we'll walk you through the signs that mean it's time.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M5 30 Q30 8 55 30 Q30 52 5 30Z" />
        <circle cx="30" cy="30" r="10" /><circle cx="30" cy="30" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    meta: 'Digital Strain · 5 min read',
    title: "Screen fatigue is real. Here's what helps.",
    desc: "From the 20-20-20 rule to specialized blue-light coatings, what actually works against modern screen exhaustion.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="14" y="18" width="32" height="22" rx="3" />
        <path d="M30 40 L30 48" /><path d="M22 48 L38 48" />
        <path d="M22 26 L38 32" /><path d="M22 32 L38 26" />
      </svg>
    ),
  },
  {
    meta: "Children's Vision · 6 min read",
    title: "What to watch for in your child's vision.",
    desc: "Squinting, head tilts, and dropped grades — the early signals every parent should know about.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M30 8 L42 22 L48 38 L42 50 L18 50 L12 38 L18 22 Z" />
        <circle cx="30" cy="30" r="6" />
      </svg>
    ),
  },
]

export default function EyeHealthSection() {
  return (
    <section className="health" id="health">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">The Studio Journal</span>
          <h2>Eye health, <em>explained</em>.</h2>
          <p>A small library of plain-language guides — written so you leave the chair feeling like an informed consumer.</p>
        </div>
        <div className="health-grid">
          {articles.map((a, i) => (
            <article key={a.title} className={`health-card reveal${i > 0 ? ` delay-${i}` : ''}`}>
              <div className="top">{a.icon}</div>
              <div className="body">
                <div className="meta">{a.meta}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
