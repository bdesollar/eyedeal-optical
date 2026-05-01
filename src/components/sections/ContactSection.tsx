import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SITE_LINKS } from '../../lib/siteLinks'
import CallOrContactLink from '../CallOrContactLink'

interface FormState {
  firstName: string
  lastName: string
  phone: string
  email: string
  reason: string
  notes: string
}

const defaultForm: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  reason: 'Comprehensive eye exam',
  notes: '',
}

const ArrowRight = () => (
  <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const name = `${form.firstName} ${form.lastName}`.trim()
      const message = [`Reason: ${form.reason}`, form.notes ? `Notes: ${form.notes}` : ''].filter(Boolean).join('\n\n')
      const { error: sbError } = await supabase.from('contact_submissions').insert({
        name,
        email: form.email,
        phone: form.phone || null,
        message,
        source: 'homepage',
      })
      if (sbError) throw sbError
      setSubmitted(true)
      setForm(defaultForm)
    } catch {
      setError('Something went wrong. Please call us at 563.557.0995.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact-grid">
          {/* Info */}
          <div className="contact-info reveal">
            <span className="eyebrow">Visit the Studio</span>
            <h2>Visit our local Dubuque <em>studio</em>.</h2>
            <p className="contact-lede">
              Stop by during studio hours, call ahead, or send a note. New patients always welcome.
            </p>
            <div className="contact-note">
              <span>Best for same-day help</span>
              <p>
                We don&apos;t offer online booking. Call the studio for the fastest answer, or use the message form for general questions and visit planning.
              </p>
            </div>
            {SITE_LINKS.virtualTourUrl ? (
              <p style={{ marginTop: 14 }}>
                <a
                  href={SITE_LINKS.virtualTourUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', padding: '11px 20px', fontSize: 11 }}
                >
                  Virtual tour
                </a>
              </p>
            ) : null}

            <div className="contact-block">
              <div className="cinfo">
                <div className="lbl">Telephone</div>
                <div className="val">
                  <CallOrContactLink>1-563-557-0995</CallOrContactLink>
                </div>
              </div>
              <div className="cinfo">
                <div className="lbl">Email</div>
                <div className="val">
                  <a href="mailto:eyedealoptical1997@yahoo.com">eyedealoptical1997<br />@yahoo.com</a>
                </div>
              </div>
              <div className="cinfo">
                <div className="lbl">Address</div>
                <div className="val">
                  <a
                    href={SITE_LINKS.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-address-link"
                    aria-label="Open Eyedeal Optical in maps"
                  >
                    2644 Pennsylvania Ave.<br />Dubuque, IA 52001
                  </a>
                </div>
              </div>
              <div className="cinfo">
                <div className="lbl">Owner</div>
                <div className="val">
                  Bob Pierce<br />
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: "'Inter',sans-serif" }}>Optician · since 1997</span>
                </div>
              </div>
              <div className="cinfo">
                <div className="lbl">Office</div>
                <div className="val">
                  Adah<br />
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: "'Inter',sans-serif" }}>Office manager</span>
                </div>
              </div>
            </div>

            <div className="contact-logistics">
              <div className="contact-map-card">
                <iframe
                  className="contact-map-frame"
                  title="Eyedeal Optical on Google Maps"
                  src="https://www.google.com/maps?q=2644+Pennsylvania+Ave+Dubuque+IA+52001&output=embed"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a href={SITE_LINKS.maps} target="_blank" rel="noreferrer" className="contact-map-caption">
                  Open directions in your maps app
                </a>
              </div>

              <div className="hours">
                <h5>Studio Hours</h5>
                <div className="hr"><span className="day">Monday – Friday</span><span className="tm">9:00 AM — 5:00 PM</span></div>
                <div className="hr"><span className="day">Saturday</span><span className="tm">9:00 AM — 12:00 PM</span></div>
                <div className="hr closed"><span className="day">Sunday</span><span className="tm">Closed</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="cform reveal delay-1" onSubmit={handleSubmit}>
            <span className="eyebrow on-dark">Send a message</span>
            <h3>Tell us how we can <em>help</em>.</h3>
            <p className="cform-intro">Questions about exams, frame fittings, adjustments, contacts, or insurance are welcome.</p>

            <div className="field-row">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" type="text" placeholder="Jane" required value={form.firstName} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Doe" required value={form.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" placeholder="(563) 555-0123" value={form.phone} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@email.com" required value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="reason">Reason for visit</label>
              <select id="reason" name="reason" value={form.reason} onChange={handleChange}>
                <option>Comprehensive eye exam</option>
                <option>Frame fitting &amp; selection</option>
                <option>Contact lens fitting</option>
                <option>Adjustment or repair</option>
                <option>Something else</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea id="notes" name="notes" placeholder="Anything we should know before you arrive..." value={form.notes} onChange={handleChange} />
            </div>

            {error && <p style={{ color: 'var(--brass)', fontSize: '13px', marginBottom: '8px' }}>{error}</p>}

            <button
              className="btn btn-gold"
              type="submit"
              disabled={submitting}
              style={submitted ? { background: 'var(--brass)', color: 'var(--navy)' } : {}}
            >
              {submitted ? 'Request Sent ✓' : submitting ? 'Sending…' : <>Send Request <ArrowRight /></>}
            </button>
            <p className="cform-footnote">
              Need a quicker answer? <CallOrContactLink>Call {SITE_LINKS.studioPhoneDisplay}</CallOrContactLink>.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
