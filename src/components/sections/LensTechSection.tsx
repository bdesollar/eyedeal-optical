import { useState } from 'react'

const lensData = [
  {
    title: 'Single Vision — perfectly clear, edge to edge.',
    body: 'For one focal distance — driving, reading, or all-day wear. Cut on-site to your exact prescription with optical centers measured digitally.',
    list: ['Digital free-form surfacing', 'Aspheric thinning available', 'Optional polarization for sun'],
  },
  {
    title: 'Progressives — three prescriptions, no line.',
    body: 'Seamless transitions from distance to intermediate to near, with German-engineered geometry that feels natural from day one.',
    list: ['GSRx HD progressive geometry', 'Personalized to your fit & frame', 'Adaptation guarantee included'],
  },
  {
    title: 'HD Coatings — clarity you can feel.',
    body: 'Anti-reflective, scratch-resistant, hydrophobic, and oleophobic layers stacked for sharper vision and easier cleaning.',
    list: ['Premium AR coating (multi-layer)', 'Blue-light filtering (optional)', 'Hydrophobic & smudge-resistant'],
  },
  {
    title: 'Specialty — sport, safety, and beyond.',
    body: 'Sport-specific lens curves, OSHA-rated safety lenses through Safevision, and specialty tints for occupational needs.',
    list: ['Polycarbonate & Trivex impact lenses', 'Sport wraps with optical inserts', 'Safevision industrial program'],
  },
]

const tabLabels = ['Single Vision', 'Progressives', 'HD Coatings', 'Specialty']

export default function LensTechSection() {
  const [activeTab, setActiveTab] = useState(0)
  const d = lensData[activeTab]

  return (
    <section className="lens" id="lens">
      <div className="wrap">
        <div className="lens-grid">
          {/* Visual */}
          <div className="lens-visual reveal">
            <svg viewBox="0 0 500 500" fill="none">
              <circle cx="250" cy="250" r="240" stroke="#C9A961" strokeWidth=".4" opacity=".3" />
              <circle cx="250" cy="250" r="200" stroke="#C9A961" strokeWidth=".4" opacity=".4" />
              <circle cx="250" cy="250" r="160" stroke="#0F1A2E" strokeWidth=".6" opacity=".5" />
              <ellipse cx="250" cy="250" rx="160" ry="120" stroke="#0F1A2E" strokeWidth="1.5" />
              <ellipse cx="250" cy="250" rx="160" ry="120" fill="url(#lensGrad)" opacity=".4" />
              <path d="M50 150 L250 250" stroke="#C9A961" strokeWidth=".8" />
              <path d="M50 200 L250 250" stroke="#C9A961" strokeWidth=".8" />
              <path d="M50 250 L250 250" stroke="#C9A961" strokeWidth="1" />
              <path d="M50 300 L250 250" stroke="#C9A961" strokeWidth=".8" />
              <path d="M50 350 L250 250" stroke="#C9A961" strokeWidth=".8" />
              <circle cx="250" cy="250" r="6" fill="#0F1A2E" />
              <circle cx="250" cy="250" r="14" stroke="#0F1A2E" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M250 250 L460 250" stroke="#0F1A2E" strokeWidth="1.2" />
              <path d="M250 250 L460 230" stroke="#0F1A2E" strokeWidth="1" opacity=".5" />
              <path d="M250 250 L460 270" stroke="#0F1A2E" strokeWidth="1" opacity=".5" />
              <path d="M150 165 Q250 145 350 165" stroke="#C9A961" strokeWidth=".8" strokeDasharray="3 3" />
              <path d="M150 335 Q250 355 350 335" stroke="#C9A961" strokeWidth=".8" strokeDasharray="3 3" />
              <defs>
                <radialGradient id="lensGrad" cx=".4" cy=".4">
                  <stop offset="0%" stopColor="#C9A961" stopOpacity=".3" />
                  <stop offset="100%" stopColor="#0F1A2E" stopOpacity=".05" />
                </radialGradient>
              </defs>
              <line x1="250" y1="115" x2="250" y2="100" stroke="#0F1A2E" strokeWidth=".6" />
              <line x1="250" y1="385" x2="250" y2="400" stroke="#0F1A2E" strokeWidth=".6" />
              <line x1="85" y1="250" x2="70" y2="250" stroke="#0F1A2E" strokeWidth=".6" />
              <line x1="415" y1="250" x2="430" y2="250" stroke="#0F1A2E" strokeWidth=".6" />
            </svg>
            <div className="label l1"><span className="num">i.</span>HD Coating</div>
            <div className="label l2"><span className="num">ii.</span>Anti-Reflective</div>
            <div className="label l3"><span className="num">iii.</span>Optical Center</div>
            <div className="label l4"><span className="num">iv.</span>German-Designed</div>
          </div>

          {/* Content */}
          <div className="lens-content reveal delay-1">
            <span className="eyebrow">Lens Technology</span>
            <h2>German-engineered<br />lenses, cut <em>here</em>.</h2>
            <p>Through our partnership with <strong>GSRx</strong> — an independent US lab specializing in German-designed optics and HD coatings — every prescription is finished on-site to exacting standards.</p>

            <div className="lens-tabs">
              {tabLabels.map((label, i) => (
                <button
                  key={label}
                  className={`lens-tab${activeTab === i ? ' active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="lens-panel">
              <h3>{d.title}</h3>
              <p>{d.body}</p>
              <ul>
                {d.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
