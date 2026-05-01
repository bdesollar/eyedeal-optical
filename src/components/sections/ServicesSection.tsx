import { SITE_LINKS } from '../../lib/siteLinks'
import CallOrContactLink from '../CallOrContactLink'

const services: {
  num: string
  title: string
  desc: string
  more: string
  href: string
  icon: React.ReactNode
}[] = [
  {
    num: '01',
    title: 'Comprehensive Eye Exams',
    desc: 'Full-spectrum vision and ocular health evaluations using the latest digital diagnostic equipment.',
    more: 'Call to schedule',
    href: SITE_LINKS.studioTelHref,
    icon: (
      <svg className="ico" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M5 30c5-12 15-18 25-18s20 6 25 18c-5 12-15 18-25 18S10 42 5 30z" />
        <circle cx="30" cy="30" r="9" />
        <circle cx="30" cy="30" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Designer Frames',
    desc: "Hand-picked by Bob from the world's most respected houses — each chosen for craft, fit, and character.",
    more: 'See the collection',
    href: '/#designers',
    icon: (
      <svg className="ico" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <ellipse cx="16" cy="34" rx="11" ry="9" />
        <ellipse cx="44" cy="34" rx="11" ry="9" />
        <path d="M27 34 Q30 30 33 34" />
        <path d="M5 32 L2 28" />
        <path d="M55 32 L58 28" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Contact Lenses',
    desc: "Acuvue and other premium lines, fitted with precision so your contacts feel like they aren't there at all.",
    more: 'Call about fittings',
    href: SITE_LINKS.studioTelHref,
    icon: (
      <svg className="ico" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="30" cy="30" r="20" />
        <circle cx="30" cy="30" r="13" />
        <circle cx="30" cy="30" r="6" />
        <path d="M22 24 Q26 21 28 24" strokeWidth="1" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'On-Site Lens Lab',
    desc: 'Single vision, progressive, and many specialty jobs are cut and finished here through our on-site lab and GSRx partnership — so your lenses are fit to your frame with care.',
    more: 'How we craft them',
    href: '/#lens',
    icon: (
      <svg className="ico" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M10 20 L50 20 L46 40 L14 40 Z" />
        <path d="M22 40 L20 50" />
        <path d="M38 40 L40 50" />
        <circle cx="30" cy="30" r="5" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Sport & Safety Eyewear',
    desc: 'Sport-specific frames and OSHA-rated safety lenses through our Safevision partnership for local businesses.',
    more: 'Insurance & plans',
    href: '/#insurance',
    icon: (
      <svg className="ico" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M8 32 L20 14 L40 14 L52 32 L40 50 L20 50 Z" />
        <circle cx="30" cy="32" r="7" />
        <path d="M16 22 L26 32" />
        <path d="M44 22 L34 32" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Adjustments for Life',
    desc: "Free frame adjustments, maintenance, and minor repairs — for as long as you wear them. That's the promise.",
    more: 'Visit the studio',
    href: '/#contact',
    icon: (
      <svg className="ico" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M20 14 L40 14 L44 30 L36 46 L24 46 L16 30 Z" />
        <path d="M30 14 L30 46" strokeDasharray="2 2" />
        <path d="M14 36 L46 36" strokeDasharray="2 2" />
      </svg>
    ),
  },
]

function ServiceCard(s: (typeof services)[0], i: number) {
  const delayClass = i > 0 && i % 3 !== 0 ? ` delay-${i % 3}` : ''
  const inner = (
    <>
      <span className="num">{s.num}</span>
      {s.icon}
      <h3>{s.title}</h3>
      <p>{s.desc}</p>
      <span className="more">
        {s.more} <span>→</span>
      </span>
    </>
  )
  if (s.href === SITE_LINKS.studioTelHref) {
    return (
      <CallOrContactLink key={s.num} className={`svc reveal${delayClass}`}>
        {inner}
      </CallOrContactLink>
    )
  }
  return (
    <a key={s.num} href={s.href} className={`svc reveal${delayClass}`}>
      {inner}
    </a>
  )
}

export default function ServicesSection() {
  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">What We Do</span>
          <h2>
            Comprehensive vision care,
            <br />
            crafted with <em>care</em>.
          </h2>
          <p>From the eye exam to the final frame adjustment, every step is handled in-house by people who know your name.</p>
        </div>
        <div className="svc-grid">{services.map((s, i) => ServiceCard(s, i))}</div>
      </div>
    </section>
  )
}
