import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PublicPageShell from '../components/PublicPageShell'
import MonthGrid from '../components/appointments/MonthGrid'
import { submitAppointment, fetchSlotCounts, MAX_BOOKINGS_PER_SLOT } from '../lib/api'
import { parseYmdAndTime12ToLocal, ymd, startOfMonth } from '../lib/appointmentTime'
import type { Appointment } from '../types'

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
]

const appointmentTypes: { value: Appointment['appointment_type']; label: string }[] = [
  { value: 'eye_exam', label: 'Comprehensive eye exam' },
  { value: 'contact_fitting', label: 'Contact lens fitting' },
  { value: 'frame_consultation', label: 'Frame consultation' },
]

type Form = {
  patient_name: string
  email: string
  phone: string
  appointment_type: Appointment['appointment_type']
  preferred_time: string
  notes: string
}

const todayYmd = ymd(new Date())

export default function BookAppointment() {
  const [searchParams] = useSearchParams()
  const typeParam = searchParams.get('type') as Appointment['appointment_type'] | null
  const initialType = appointmentTypes.some((t) => t.value === typeParam) && typeParam ? typeParam : 'eye_exam'

  useEffect(() => {
    if (typeParam && appointmentTypes.some((t) => t.value === typeParam)) {
      setForm((f) => ({ ...f, appointment_type: typeParam }))
    }
  }, [typeParam])

  const [calMonth, setCalMonth] = useState(() => startOfMonth(new Date()))
  const [selectedYmd, setSelectedYmd] = useState(todayYmd)
  const [form, setForm] = useState<Form>({
    patient_name: '',
    email: '',
    phone: '',
    appointment_type: initialType,
    preferred_time: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slotMap, setSlotMap] = useState<Map<number, number>>(new Map())
  const [slotErr, setSlotErr] = useState<string | null>(null)

  const monthRange = useMemo(() => {
    const start = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1)
    const end = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0)
    return { pFrom: ymd(start), pTo: ymd(end) }
  }, [calMonth])

  useEffect(() => {
    let cancel = false
    ;(async () => {
      setSlotErr(null)
      try {
        const rows = await fetchSlotCounts(monthRange.pFrom, monthRange.pTo)
        if (cancel) return
        const m = new Map<number, number>()
        for (const r of rows) {
          const t = new Date(r.start_minute).getTime()
          m.set(t, (m.get(t) ?? 0) + (r.booking_count ?? 0))
        }
        setSlotMap(m)
      } catch (e) {
        if (cancel) return
        setSlotErr(e instanceof Error ? e.message : 'Could not load availability')
        setSlotMap(new Map())
      }
    })()
    return () => {
      cancel = true
    }
  }, [monthRange.pFrom, monthRange.pTo])

  const markedDays = useMemo(() => {
    const s = new Set<string>()
    for (const [ts, c] of slotMap) {
      if (c > 0) s.add(ymd(new Date(ts)))
    }
    return s
  }, [slotMap])

  function isSlotAvailable(time12: string) {
    try {
      const d = parseYmdAndTime12ToLocal(selectedYmd, time12)
      const t = d.getTime()
      const n = slotMap.get(t) ?? 0
      return n < MAX_BOOKINGS_PER_SLOT
    } catch {
      return true
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.preferred_time) {
      setError('Please choose a time slot.')
      return
    }
    if (!isSlotAvailable(form.preferred_time)) {
      setError('That time was just taken—pick another slot or call the studio.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const scheduled = parseYmdAndTime12ToLocal(selectedYmd, form.preferred_time)
      await submitAppointment({
        patient_name: form.patient_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        appointment_type: form.appointment_type,
        preferred_date: selectedYmd,
        preferred_time: form.preferred_time,
        notes: form.notes.trim() || null,
        scheduled_start: scheduled.toISOString(),
      })
      setSuccess(true)
      setForm({
        patient_name: '',
        email: '',
        phone: '',
        appointment_type: initialType,
        preferred_time: '',
        notes: '',
      })
    } catch {
      setError('Something went wrong. Please call (563) 557-0995 to book.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <PublicPageShell>
        <div className="book-success">
          <h1 className="book-title">Request received</h1>
          <p className="book-lead">We’ll confirm your visit within one business day by email or phone.</p>
          <button type="button" className="btn btn-primary" onClick={() => setSuccess(false)}>
            Book another
          </button>
        </div>
      </PublicPageShell>
    )
  }

  return (
    <PublicPageShell>
      <div className="book-page">
        <header className="book-header">
          <span className="eyebrow">Schedule</span>
          <h1 className="book-title">Book an appointment</h1>
          <p className="book-lead">Choose a day, then a time. We’ll follow up to confirm—same as a call to the studio.</p>
        </header>

        <div className="book-layout">
          <div className="book-cal-card">
            <h2 className="book-h2">1. Pick a date</h2>
            <MonthGrid
              month={calMonth}
              selected={selectedYmd}
              onMonthChange={setCalMonth}
              onSelectDay={setSelectedYmd}
              markedDays={markedDays}
              minYmd={todayYmd}
            />
            {slotErr && <p className="book-hint book-hint--warn">{slotErr} You can still pick a time; we may show no conflicts yet.</p>}
          </div>

          <form className="book-form cform" onSubmit={handleSubmit} style={{ background: 'var(--navy)' }}>
            <h2 className="book-h2" style={{ color: 'var(--cream)', fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, marginBottom: '8px' }}>
              2. Your details
            </h2>
            <p className="book-hint" style={{ color: 'rgba(245,237,224,.75)', marginBottom: '20px' }}>
              Selected day: <strong style={{ color: 'var(--cream)' }}>{new Date(selectedYmd + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
            </p>

            <div className="field-row">
              <div className="field">
                <label htmlFor="bn">Full name</label>
                <input id="bn" name="patient_name" required value={form.patient_name} onChange={handleChange} autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="em">Email</label>
                <input id="em" name="email" type="email" required value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="ph">Phone (optional)</label>
              <input id="ph" name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" />
            </div>
            <div className="field">
              <label htmlFor="at">Visit type</label>
              <select
                id="at"
                name="appointment_type"
                value={form.appointment_type}
                onChange={handleChange}
                required
              >
                {appointmentTypes.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="pt">Preferred time *</label>
              <select id="pt" name="preferred_time" value={form.preferred_time} onChange={handleChange} required>
                <option value="">Select a time</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t} disabled={!isSlotAvailable(t)}>
                    {t}
                    {!isSlotAvailable(t) ? ' (full)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="nt">Notes (optional)</label>
              <textarea id="nt" name="notes" rows={3} value={form.notes} onChange={handleChange} />
            </div>
            {error && <p style={{ color: 'var(--brass)', fontSize: '13px' }}>{error}</p>}
            <button className="btn btn-gold" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {submitting ? 'Sending…' : 'Request this time'}
            </button>
          </form>
        </div>
      </div>
    </PublicPageShell>
  )
}
