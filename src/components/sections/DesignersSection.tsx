const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const brands: { id: string; name: React.ReactNode; tag: string; href?: string }[] = [
  { id: 'scott-harris', name: <>Scott <em>Harris</em></>, tag: 'Contemporary American', href: 'https://europaeye.com/brands/scott-harris' },
  { id: 'cinzia', name: <>Cin<em>zia</em></>, tag: 'Bold · artistic', href: 'https://europaeye.com/brands/cinzia' },
  { id: 'state', name: <>S<em>tate</em></>, tag: 'Optical + sun', href: 'https://stateopticalco.com' },
  { id: 'michael-ryen', name: <>Michael <em>Ryen</em></>, tag: 'Refined · wearable', href: 'https://michaelryen.com' },
  { id: 'dolabany', name: <>Dola<em>bany</em></>, tag: 'Heritage quality', href: 'https://dolabanyeyewear.com' },
  { id: 'david-spencer', name: <>David <em>Spencer</em></>, tag: 'Classic lines', href: 'https://davidspencereyewear.com/' },
  { id: 'oakley', name: <>Oak<em>ley</em></>, tag: 'Performance · Prizm' },
  { id: 'ray-ban', name: <>Ray-<em>Ban</em></>, tag: 'Icons · wayfarer & aviator' },
  { id: 'ray-ban-meta', name: <>Ray-Ban <em>Meta</em></>, tag: 'Smart eyewear' },
  { id: 'maui-jim', name: <>Maui <em>Jim</em></>, tag: 'PolarizedPlus2' },
  { id: 'minamoto', name: <>Mina<em>moto</em></>, tag: 'Japanese craft', href: 'https://minamoto-eyewear.com/en/' },
  { id: 'fysh', name: <>F<em>ysh</em></>, tag: 'Color · detail', href: 'https://fyshuk.com' },
  { id: 'kliik', name: <>K<em>liik</em></>, tag: 'Petite fits · minimal modern', href: 'https://www.kliik.com/' },
  { id: 'revolution', name: <>Revol<em>ution</em></>, tag: 'Everyday style' },
]

const rayBanMetaImage = {
  src: '/ray-ban-meta-blended.jpg',
  alt: 'Ray-Ban Meta smart glasses in black',
}

const collectionImages = [
  {
    label: 'Oakley',
    title: 'Performance optical',
    body: 'Sport-forward frame design with modern fit and engineered comfort.',
    src: 'https://images.unsplash.com/photo-1755719402885-b7baa634c755?q=80&w=1200&auto=format&fit=crop',
    alt: 'Round eyeglasses with metal frames on a clean surface',
    inStoreOnly: true,
  },
  {
    label: 'Ray-Ban',
    title: 'Black frame icons',
    body: 'Classic acetate styling with timeless shapes that stay in rotation.',
    src: 'https://images.unsplash.com/photo-1556540241-5e1be298dd70?q=80&w=1200&auto=format&fit=crop',
    alt: 'Black framed eyeglasses near a window',
    inStoreOnly: true,
  },
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
          <div className="designer-featured-copy">
            <span className="eyebrow on-dark">Featured</span>
            <h3>
              Ray-Ban <em>Meta</em> — smart eyewear
            </h3>
            <p>
              We carry Ray-Ban Meta frames — iconic Ray-Ban style with built-in technology. Stop in to see what&apos;s in stock and how they can fit your prescription and lifestyle.
            </p>
          </div>
          <figure className="designer-featured-media designer-featured-media--fill">
            <video
              className="designer-featured-video"
              src="https://media.ray-ban.com/docs/ray-ban-meta/smart-glasses-video.mp4"
              poster={rayBanMetaImage.src}
              title={rayBanMetaImage.alt}
              autoPlay
              muted
              loop
              controls
              playsInline
              preload="auto"
              aria-label={rayBanMetaImage.alt}
            />
          </figure>
        </div>

        <div className="collection-visual-grid reveal delay-1" aria-label="Featured eyewear styles">
          {collectionImages.map((item) => (
            <article key={item.title} className="collection-visual-card">
              <div className="collection-visual-card__media">
                <img src={item.src} alt={item.alt} loading="lazy" />
              </div>
              <div className="collection-visual-card__body">
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.inStoreOnly ? <small className="in-store-badge">In store only</small> : null}
              </div>
            </article>
          ))}
        </div>

        <div className="designer-roster-head reveal delay-2">
          <span className="eyebrow on-dark">Full collection</span>
          <p>Explore the rest of the wall: independent optical houses, performance eyewear, sunwear, smart frames, and everyday staples.</p>
        </div>

        <div className="designer-grid reveal delay-2">
          {brands.map((b) =>
            b.href ? (
              <a
                key={b.id}
                className="designer-chip"
                href={b.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${b.id.replaceAll('-', ' ')} website`}
              >
                <span className="nm">{b.name}</span>
                <span className="tg">{b.tag}</span>
              </a>
            ) : (
              <div key={b.id} className="designer-chip designer-chip--static" aria-label={`${b.id.replaceAll('-', ' ')} brand`}>
                <span className="nm">{b.name}</span>
                <span className="tg">{b.tag}</span>
                <span className="in-store-badge">In store only</span>
              </div>
            ),
          )}
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
