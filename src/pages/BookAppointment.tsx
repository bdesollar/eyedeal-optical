import { useState } from 'react'
import { submitAppointment } from '../lib/api'
import type { Appointment } from '../types'

type FormData = Omit<Appointment, 'id' | 'status' | 'created_at'>

const defaultForm: FormData = {
  patient_name: '',
  email: '',
  phone: '',
  appointment_type: 'eye_exam',
  preferred_date: '',
  preferred_time: '',
  notes: '',
}

const appointmentTypes: { value: Appointment['appointment_type']; label: string }[] = [
  { value: 'eye_exam', label: 'Comprehensive Eye Exam' },
  { value: 'contact_fitting', label: 'Contact Lens Fitting' },
  { value: 'frame_consultation', label: 'Frame Consultation' },
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
]

export default function BookAppointment() {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await submitAppointment(form)
      setSuccess(true)
      setForm(defaultForm)
    } catch {
      setError('Something went wrong. Please call us directly to book your appointment.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Appointment Request Submitted!</h2>
        <p className="text-gray-600 mb-8">
          We'll confirm your appointment within 24 hours via email or phone.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Book Another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
      <p className="text-gray-500 mb-8">Fill out the form and we'll confirm your slot within 24 hours.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              name="patient_name"
              value={form.patient_name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jane@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(000) 000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type *</label>
            <select
              name="appointment_type"
              value={form.appointment_type}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {appointmentTypes.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
            <input
              name="preferred_date"
              type="date"
              min={today}
              value={form.preferred_date}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
            <select
              name="preferred_time"
              value={form.preferred_time}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a time</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Insurance info, vision concerns, etc."
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Request Appointment'}
        </button>
      </form>
    </div>
  )
}
