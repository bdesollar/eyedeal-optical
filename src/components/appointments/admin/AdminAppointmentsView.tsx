import { useMemo, useState } from 'react'
import type { Appointment } from '../../../types'
import { insertManualAppointment, updateAppointment } from '../../../lib/api'
import { parseYmdAndTime12ToLocal, ymd, startOfMonth } from '../../../lib/appointmentTime'
import MonthGrid from '../MonthGrid'

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
]

const apptTypeOptions: { value: Appointment['appointment_type']; label: string }[] = [
  { value: 'eye_exam', label: 'Eye exam' },
  { value: 'contact_fitting', label: 'Contact fitting' },
  { value: 'frame_consultation', label: 'Frame consultation' },
]

function typeLabel(t: Appointment['appointment_type']) {
  return apptTypeOptions.find((o) => o.value === t)?.label ?? t
}

function statusLabel(s: Appointment['status']) {
  if (s === 'pending') return 'Pending'
  if (s === 'confirmed') return 'Confirmed'
  return 'Cancelled'
}

type Props = {
  appointments: Appointment[]
  onRefresh: () => Promise<void>
}

export default function AdminAppointmentsView({ appointments, onRefresh }: Props) {
  const [mode, setMode] = useState<'list' | 'schedule'>('schedule')
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDay, setSelectedDay] = useState(() => ymd(new Date()))
  const [editing, setEditing] = useState<Appointment | null>(null)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const markedDays = useMemo(() => {
    const s = new Set<string>()
    for (const a of appointments) {
      if (a.status === 'cancelled') continue
      if (a.scheduled_start) s.add(ymd(new Date(a.scheduled_start)))
      else s.add(a.preferred_date)
    }
    return s
  }, [appointments])

  const sortedAll = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const da = a.scheduled_start
        ? new Date(a.scheduled_start).getTime()
        : new Date(`${a.preferred_date}T12:00:00`).getTime()
      const db = b.scheduled_start
        ? new Date(b.scheduled_start).getTime()
        : new Date(`${b.preferred_date}T12:00:00`).getTime()
      return db - da
    })
  }, [appointments])

  const forSelectedDay = useMemo(() => {
    return sortedAll.filter((a) => {
      const d = a.scheduled_start ? ymd(new Date(a.scheduled_start)) : a.preferred_date
      return d === selectedDay
    })
  }, [sortedAll, selectedDay])

  const tableRows = mode === 'list' ? sortedAll : forSelectedDay

  async function saveEdit(patch: {
    id: string
    patient_name: string
    email: string
    phone: string
    appointment_type: Appointment['appointment_type']
    preferred_date: string
    preferred_time: string
    notes: string
    admin_notes: string
    status: Appointment['status']
    duration_minutes: number
  }) {
    setSaving(true)
    setFormError(null)
    try {
      const scheduled = parseYmdAndTime12ToLocal(patch.preferred_date, patch.preferred_time)
      await updateAppointment(patch.id, {
        patient_name: patch.patient_name,
        email: patch.email,
        phone: patch.phone || null,
        appointment_type: patch.appointment_type,
        preferred_date: patch.preferred_date,
        preferred_time: patch.preferred_time,
        notes: patch.notes || null,
        admin_notes: patch.admin_notes || null,
        status: patch.status,
        duration_minutes: patch.duration_minutes,
        scheduled_start: scheduled.toISOString(),
      })
      setEditing(null)
      await onRefresh()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  async function saveAdd(data: {
    patient_name: string
    email: string
    phone: string
    appointment_type: Appointment['appointment_type']
    preferred_date: string
    preferred_time: string
    notes: string
    admin_notes: string
    status: Appointment['status']
    duration_minutes: number
  }) {
    setSaving(true)
    setFormError(null)
    try {
      const scheduled = parseYmdAndTime12ToLocal(data.preferred_date, data.preferred_time)
      await insertManualAppointment({
        patient_name: data.patient_name,
        email: data.email,
        phone: data.phone || null,
        appointment_type: data.appointment_type,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        notes: data.notes || null,
        status: data.status,
        scheduled_start: scheduled.toISOString(),
        duration_minutes: data.duration_minutes,
        admin_notes: data.admin_notes || null,
      })
      setAdding(false)
      await onRefresh()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not add')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-appt">
      <div className="admin-appt-toolbar">
        <div className="admin-appt-modes" role="group" aria-label="Appointments view">
          <button type="button" className={mode === 'schedule' ? 'active' : ''} onClick={() => setMode('schedule')}>
            Calendar
          </button>
          <button type="button" className={mode === 'list' ? 'active' : ''} onClick={() => setMode('list')}>
            All requests
          </button>
        </div>
        <button type="button" className="admin-btn admin-btn--inline" onClick={() => { setFormError(null); setAdding(true) }}>
          + Add manually
        </button>
      </div>

      {mode === 'schedule' && (
        <div className="admin-appt-cal-wrap">
          <MonthGrid
            month={month}
            selected={selectedDay}
            onMonthChange={setMonth}
            onSelectDay={setSelectedDay}
            markedDays={markedDays}
            minYmd="2020-01-01"
          />
          <p className="admin-appt-day-hint">
            {new Date(selectedDay + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}{' '}
            — {forSelectedDay.length} appointment{forSelectedDay.length === 1 ? '' : 's'}
          </p>
        </div>
      )}

      {formError && <p className="admin-banner" style={{ marginBottom: 12 }}>{formError}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Requested</th>
              <th>Patient</th>
              <th>Contact</th>
              <th>Type</th>
              <th>When</th>
              <th>Status</th>
              <th>Source</th>
              <th>Notes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tableRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="admin-empty">
                  {mode === 'schedule' ? 'Nothing on this day.' : 'No appointment requests yet.'}
                </td>
              </tr>
            ) : (
              tableRows.map((a) => (
                <tr key={a.id}>
                  <td className="admin-cell-tiny">{new Date(a.created_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{a.patient_name}</td>
                  <td className="admin-cell-tiny">
                    <div>{a.email}</div>
                    <div>{a.phone || '—'}</div>
                  </td>
                  <td>{typeLabel(a.appointment_type)}</td>
                  <td>
                    {a.scheduled_start
                      ? new Date(a.scheduled_start).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                      : `${a.preferred_date} ${a.preferred_time}`}
                  </td>
                  <td>
                    <span className="admin-pill admin-pill--subtle">{statusLabel(a.status)}</span>
                  </td>
                  <td>{a.source === 'admin_manual' ? 'Manual' : 'Web'}</td>
                  <td className="admin-cell-notes">
                    {a.notes || '—'}
                    {a.admin_notes ? <div className="admin-appt-admin-note">Staff: {a.admin_notes}</div> : null}
                  </td>
                  <td>
                    <button type="button" className="admin-linkish" onClick={() => { setFormError(null); setEditing(a) }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ApptFormModal
          key={editing.id}
          title="Edit appointment"
          initial={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}

      {adding && (
        <ApptFormModal
          key="new-manual"
          title="Add appointment (manual)"
          initial={null}
          defaultDate={selectedDay}
          saving={saving}
          onClose={() => setAdding(false)}
          onSaveAdd={saveAdd}
        />
      )}
    </div>
  )
}

type EditPayload = {
  id: string
  patient_name: string
  email: string
  phone: string
  appointment_type: Appointment['appointment_type']
  preferred_date: string
  preferred_time: string
  notes: string
  admin_notes: string
  status: Appointment['status']
  duration_minutes: number
}

type AddPayload = Omit<EditPayload, 'id'>

function ApptFormModal({
  title,
  initial,
  defaultDate,
  saving,
  onClose,
  onSave,
  onSaveAdd,
}: {
  title: string
  initial: Appointment | null
  defaultDate?: string
  saving: boolean
  onClose: () => void
  onSave?: (p: EditPayload) => void
  onSaveAdd?: (p: AddPayload) => void
}) {
  const [patient_name, setPatient] = useState(initial?.patient_name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [phone, setPhone] = useState(() => (initial?.phone != null ? String(initial.phone) : ''))
  const [appointment_type, setType] = useState<Appointment['appointment_type']>(initial?.appointment_type ?? 'eye_exam')
  const [preferred_date, setDate] = useState(
    initial ? (initial.scheduled_start ? ymd(new Date(initial.scheduled_start)) : initial.preferred_date) : defaultDate ?? ymd(new Date()),
  )
  const [preferred_time, setTime] = useState(initial?.preferred_time ?? '10:00 AM')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [admin_notes, setAdminNotes] = useState(initial?.admin_notes ?? '')
  const [status, setStatus] = useState<Appointment['status']>(initial?.status ?? 'confirmed')
  const [duration_minutes, setDur] = useState(() => (initial != null && typeof initial.duration_minutes === 'number' ? initial.duration_minutes : 30))

  return (
    <div className="admin-modal-back" role="dialog" aria-modal="true" aria-labelledby="appt-modal-title" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2 id="appt-modal-title" className="admin-modal-title">
          {title}
        </h2>
        <form
          className="admin-form admin-form--grid"
          onSubmit={(e) => {
            e.preventDefault()
            if (initial && onSave) {
              onSave({
                id: initial.id,
                patient_name: patient_name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                appointment_type,
                preferred_date,
                preferred_time,
                notes,
                admin_notes,
                status,
                duration_minutes,
              })
            } else if (onSaveAdd) {
              onSaveAdd({
                patient_name: patient_name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                appointment_type,
                preferred_date,
                preferred_time,
                notes,
                admin_notes,
                status,
                duration_minutes,
              })
            }
          }}
        >
          <label className="admin-label">
            Name
            <input className="admin-input" value={patient_name} onChange={(e) => setPatient(e.target.value)} required />
          </label>
          <label className="admin-label">
            Email
            <input className="admin-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="admin-label">
            Phone
            <input className="admin-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="admin-label">
            Type
            <select className="admin-input" value={appointment_type} onChange={(e) => setType(e.target.value as Appointment['appointment_type'])}>
              {apptTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-label">
            Date
            <input className="admin-input" type="date" value={preferred_date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label className="admin-label">
            Time
            <select className="admin-input" value={preferred_time} onChange={(e) => setTime(e.target.value)} required>
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-label">
            Status
            <select className="admin-input" value={status} onChange={(e) => setStatus(e.target.value as Appointment['status'])}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="admin-label">
            Duration (min)
            <input
              className="admin-input"
              type="number"
              min={15}
              max={180}
              step={5}
              value={duration_minutes}
              onChange={(e) => setDur(parseInt(e.target.value, 10) || 30)}
            />
          </label>
          <label className="admin-label admin-label--full">
            Patient message
            <textarea className="admin-input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <label className="admin-label admin-label--full">
            Internal notes
            <textarea className="admin-input" rows={2} value={admin_notes} onChange={(e) => setAdminNotes(e.target.value)} />
          </label>
          <div className="admin-modal-actions">
            <button type="button" className="admin-link-btn" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="admin-btn" disabled={saving || !patient_name.trim() || !email.trim()}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
