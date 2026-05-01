const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const brands: { id: string; name: React.ReactNode; tag: string; href: string }[] = [
  { id: 'scott-harris', name: <>Scott <em>Harris</em></>, tag: 'Contemporary American', href: 'https://scottharrisglasses.com/' },
  { id: 'cinzia', name: <>Cin<em>zia</em></>, tag: 'Bold · artistic', href: 'https://www.cinzia.com' },
  { id: 'state', name: <>S<em>tate</em></>, tag: 'Optical + sun', href: 'https://stateopticalco.com' },
  { id: 'michael-ryen', name: <>Michael <em>Ryen</em></>, tag: 'Refined · wearable', href: 'https://michaelryen.com' },
  { id: 'dolabany', name: <>Dola<em>bany</em></>, tag: 'Heritage quality', href: 'https://dolabanyeyewear.com' },
  { id: 'david-spencer', name: <>David <em>Spencer</em></>, tag: 'Classic lines', href: 'https://www.davidspencer.com' },
  { id: 'oakley', name: <>Oak<em>ley</em></>, tag: 'Performance · Prizm', href: 'https://www.oakley.com/en-us' },
  { id: 'ray-ban', name: <>Ray-<em>Ban</em></>, tag: 'Icons · wayfarer & aviator', href: 'https://www.ray-ban.com/usa' },
  { id: 'ray-ban-meta', name: <>Ray-Ban <em>Meta</em></>, tag: 'Smart eyewear', href: 'https://www.ray-ban.com/usa/ray-ban-meta-ai-glasses' },
  { id: 'maui-jim', name: <>Maui <em>Jim</em></>, tag: 'PolarizedPlus2', href: 'https://www.mauijim.com' },
  { id: 'minamoto', name: <>Mina<em>moto</em></>, tag: 'Japanese craft', href: 'https://minamoto-eyewear.com/en/' },
  { id: 'fysh', name: <>F<em>ysh</em></>, tag: 'Color · detail', href: 'https://fyshuk.com' },
  { id: 'kliik', name: <>K<em>liik</em></>, tag: 'Minimal · modern', href: 'https://www.kliik.com/' },
  { id: 'revolution', name: <>Revol<em>ution</em></>, tag: 'Everyday style', href: 'https://www.revolutioneyewear.com' },
]

const rayBanMetaImage = {
  src: '/ray-ban-meta.jpg',
  alt: 'Ray-Ban Meta smart glasses in black',
  href: 'https://www.ray-ban.com/usa/ray-ban-meta-ai-glasses',
}

const collectionImages = [
  {
    label: 'Oakley',
    title: 'Performance optical',
    body: 'Sport-forward frame design with modern fit and engineered comfort.',
    src: 'https://images.unsplash.com/photo-1755719402885-b7baa634c755?q=80&w=1200&auto=format&fit=crop',
    alt: 'Round eyeglasses with metal frames on a clean surface',
    href: 'https://www.oakley.com/en-us/category/eyeglasses',
  },
  {
    label: 'Ray-Ban',
    title: 'Black frame icons',
    body: 'Classic acetate styling with timeless shapes that stay in rotation.',
    src: 'https://images.unsplash.com/photo-1556540241-5e1be298dd70?q=80&w=1200&auto=format&fit=crop',
    alt: 'Black framed eyeglasses near a window',
    href: 'https://www.ray-ban.com/usa/eyeglasses',
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
          <a
            className="designer-featured-media"
            href={rayBanMetaImage.href}
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Ray-Ban Meta product page"
          >
            <img
              src={rayBanMetaImage.src}
              alt={rayBanMetaImage.alt}
              loading="lazy"
            />
            <figcaption>Ray-Ban Meta available in select styles</figcaption>
          </a>
        </div>

        <div className="collection-visual-grid reveal delay-1" aria-label="Featured eyewear styles">
          {collectionImages.map((item) => (
            <a
              key={item.title}
              className="collection-visual-card"
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${item.label} website`}
            >
              <div className="collection-visual-card__media">
                <img src={item.src} alt={item.alt} loading="lazy" />
              </div>
              <div className="collection-visual-card__body">
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="designer-roster-head reveal delay-2">
          <span className="eyebrow on-dark">Full collection</span>
          <p>Explore the rest of the wall: independent optical houses, performance eyewear, sunwear, smart frames, and everyday staples.</p>
        </div>

        <div className="designer-grid reveal delay-2">
          {brands.map((b) => (
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
