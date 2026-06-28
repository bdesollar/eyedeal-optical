import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminUpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [allow, setAllow] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const readType = () => new URLSearchParams(window.location.hash.slice(1)).get('type')
    const t0 = readType()
    if (t0 === 'recovery' || t0 === 'invite' || t0 === 'signup') setAllow(true)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setAllow(true)
    })

    void supabase.auth.getSession().then(({ data: { session } }) => {
      const t = readType()
      if (session && (t === 'recovery' || t === 'invite' || t === 'signup')) setAllow(true)
      setSessionChecked(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const { error: updErr } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updErr) {
      setError(updErr.message)
      return
    }
    setSuccess('Password updated. You can sign in with your new password.')
    await supabase.auth.signOut()
  }

  const showForm = allow && !success

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <p className="admin-eyebrow">Staff</p>
        <h1 className="admin-title">{success ? 'Done' : 'Set new password'}</h1>
        {!sessionChecked ? (
          <p className="admin-muted">Checking link…</p>
        ) : success ? (
          <>
            <p className="admin-muted">{success}</p>
            <Link to="/admin/login" className="admin-btn admin-inline-success-nav">
              Go to sign in
            </Link>
          </>
        ) : !showForm ? (
          <>
            <p className="admin-error">This link is invalid or expired. Request a new reset link from the sign-in page.</p>
            <Link to="/admin/login" className="admin-back">
              ← Back to sign in
            </Link>
          </>
        ) : (
          <form className="admin-form" onSubmit={(e) => void handleSubmit(e)}>
            <label className="admin-label">
              New password
              <input
                className="admin-input"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>
            <label className="admin-label">
              Confirm password
              <input
                className="admin-input"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
            </label>
            {error && <p className="admin-error">{error}</p>}
            <button className="admin-btn" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save password'}
            </button>
          </form>
        )}
        {!success && showForm ? (
          <Link to="/admin/login" className="admin-back">
            ← Back to sign in
          </Link>
        ) : null}
      </div>
    </div>
  )
}
