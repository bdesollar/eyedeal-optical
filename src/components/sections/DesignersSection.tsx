const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const designers = [
  {
    idx: '01', name: <>Ray-<em>Ban</em></>, tag: 'Heritage Aviators · Wayfarers',
    preview: (
      <svg className="preview" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 14 L80 14 L72 50 Q50 56 38 50 L20 14Z" />
        <path d="M120 14 L180 14 L172 50 Q150 56 138 50 L120 14Z" />
        <path d="M80 22 L120 22" />
      </svg>
    ),
  },
  {
    idx: '02', name: <>Tom <em>Ford</em></>, tag: 'Acetate Sculptural · Italian Made',
    preview: (
      <svg className="preview" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="14" y="18" width="72" height="32" rx="6" />
        <rect x="114" y="18" width="72" height="32" rx="6" />
        <path d="M86 30 L114 30" />
      </svg>
    ),
  },
  {
    idx: '03', name: <>Maui <em>Jim</em></>, tag: 'PolarizedPlus2 · Lifestyle Sun',
    preview: (
      <svg className="preview" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="50" cy="32" rx="36" ry="22" />
        <ellipse cx="150" cy="32" rx="36" ry="22" />
        <path d="M86 30 L114 30" />
      </svg>
    ),
  },
  {
    idx: '04', name: <>Sil<em>houette</em></>, tag: 'Rimless · Austrian Titanium',
    preview: (
      <svg className="preview" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3">
        <ellipse cx="50" cy="32" rx="34" ry="20" />
        <ellipse cx="150" cy="32" rx="34" ry="20" />
        <path d="M84 30 L116 30" strokeDasharray="0" />
      </svg>
    ),
  },
  {
    idx: '05', name: <>Per<em>sol</em></>, tag: 'Crystal Lens · Meflecto Hinge',
    preview: (
      <svg className="preview" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 18 L86 18 L80 50 L20 50Z" />
        <path d="M114 18 L186 18 L180 50 L120 50Z" />
        <path d="M86 28 L114 28" />
      </svg>
    ),
  },
  {
    idx: '06', name: <>Oak<em>ley</em></>, tag: 'Performance · Prizm Sport Lenses',
    preview: (
      <svg className="preview" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 32 Q50 8 100 28 Q150 8 184 32 Q150 54 100 36 Q50 54 16 32Z" />
      </svg>
    ),
  },
  {
    idx: '07', name: <>Kate <em>Spade</em></>, tag: 'Optical Femme · Color-Forward',
    preview: (
      <svg className="preview" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="50" cy="32" rx="34" ry="22" />
        <ellipse cx="150" cy="32" rx="34" ry="22" />
        <path d="M84 28 L116 28" />
        <circle cx="50" cy="14" r="3" fill="currentColor" />
        <circle cx="150" cy="14" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    idx: '08', name: <>Nike <em>Vision</em></>, tag: 'Athletic Performance · Youth',
    preview: (
      <svg className="preview" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 28 Q50 14 86 28 L80 46 L20 46Z" />
        <path d="M114 28 Q150 14 186 28 L180 46 L120 46Z" />
        <path d="M86 32 L114 32" />
      </svg>
    ),
  },
]

export default function DesignersSection() {
  return (
    <section className="designers" id="designers">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow on-dark">The Collection</span>
          <h2>Frames hand-picked,<br />house by <em>house</em>.</h2>
          <p>Bob personally curates each line that earns a place on the wall — chosen for craftsmanship, materials, and how they'll wear ten years from now.</p>
        </div>

        <div className="designer-list reveal">
          {designers.map((d) => (
            <div key={d.idx} className="designer-row">
              <span className="idx">{d.idx}</span>
              <span className="name">{d.name}</span>
              <span className="tag">{d.tag}</span>
              {d.preview}
            </div>
          ))}
        </div>

        <div className="designers-cta">
          <a href="#contact" className="btn btn-gold">
            Visit the Studio
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  )
}
