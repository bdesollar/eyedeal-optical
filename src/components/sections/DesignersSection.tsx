const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const brands: { id: string; name: React.ReactNode; tag: string }[] = [
  { id: 'scott-harris', name: <>Scott <em>Harris</em></>, tag: 'Contemporary American' },
  { id: 'cinzia', name: <>Cin<em>zia</em></>, tag: 'Bold · artistic' },
  { id: 'state', name: <>S<em>tate</em></>, tag: 'Optical + sun' },
  { id: 'michael-ryen', name: <>Michael <em>Ryen</em></>, tag: 'Refined · wearable' },
  { id: 'dolabany', name: <>Dola<em>bany</em></>, tag: 'Heritage quality' },
  { id: 'david-spencer', name: <>David <em>Spencer</em></>, tag: 'Classic lines' },
  { id: 'oakley', name: <>Oak<em>ley</em></>, tag: 'Performance · Prizm' },
  { id: 'ray-ban', name: <>Ray-<em>Ban</em></>, tag: 'Icons · wayfarer & aviator' },
  { id: 'maui-jim', name: <>Maui <em>Jim</em></>, tag: 'PolarizedPlus2' },
  { id: 'minamoto', name: <>Mina<em>moto</em></>, tag: 'Japanese craft' },
  { id: 'fysh', name: <>F<em>ysh</em></>, tag: 'Color · detail' },
  { id: 'kliik', name: <>K<em>liik</em></>, tag: 'Minimal · modern' },
  { id: 'revolution', name: <>Revol<em>ution</em></>, tag: 'Everyday style' },
]

export default function DesignersSection() {
  return (
    <section className="designers" id="designers">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow on-dark">The Collection</span>
          <h2>
            Frames hand-picked,
            <br />
            house by <em>house</em>.
          </h2>
          <p>Bob personally curates each line on the wall — chosen for craftsmanship, materials, and how they&apos;ll wear for years to come.</p>
        </div>

        <div className="designer-featured reveal">
          <span className="eyebrow on-dark">Featured</span>
          <h3>
            Ray-Ban <em>Meta</em> — smart eyewear
          </h3>
          <p>
            We carry Ray-Ban Meta frames — the line that pairs iconic style with built-in technology. Stop in to see what&apos;s in stock and
            how they can fit your prescription and lifestyle.
          </p>
        </div>

        <div className="designer-grid reveal">
          {brands.map((b) => (
            <div key={b.id} className="designer-chip">
              <span className="nm">{b.name}</span>
              <span className="tg">{b.tag}</span>
            </div>
          ))}
        </div>

        <div className="designers-cta">
          <a href="/#contact" className="btn btn-gold">
            Plan your visit
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  )
}
