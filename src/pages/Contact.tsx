import { useState } from 'react'
import { submitContactForm } from '../lib/api'
import type { ContactForm } from '../types'

const defaultForm: ContactForm = { name: '', email: '', phone: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await submitContactForm(form)
      setSuccess(true)
      setForm(defaultForm)
    } catch {
      setError('Something went wrong. Please email or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
              <p className="text-gray-600">123 Main Street<br />Your City, ST 00000</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Hours</h2>
              <table className="text-sm text-gray-600 w-full">
                <tbody>
                  {[
                    ['Monday – Friday', '9:00 AM – 6:00 PM'],
                    ['Saturday', '9:00 AM – 4:00 PM'],
                    ['Sunday', 'Closed'],
                  ].map(([day, hours]) => (
                    <tr key={day}>
                      <td className="pr-6 py-1 font-medium">{day}</td>
                      <td>{hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Phone & Email</h2>
              <p className="text-gray-600">
                <a href="tel:+10000000000" className="hover:text-blue-700">(000) 000-0000</a>
              </p>
              <p className="text-gray-600 mt-1">
                <a href="mailto:info@eyedealoptical.com" className="hover:text-blue-700">
                  info@eyedealoptical.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {success ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📨</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
              <p className="text-gray-600 mb-6">We'll get back to you within 1 business day.</p>
              <button
                onClick={() => setSuccess(false)}
                className="text-blue-700 font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow-sm border p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
