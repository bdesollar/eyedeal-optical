import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isCurrentUserAdmin } from '../lib/adminAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const ok = await isCurrentUserAdmin()
      if (!cancelled && ok) navigate('/admin', { replace: true })
      if (!cancelled) setChecking(false)
    })()
    return () => {
      cancelled = true
    }
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: signErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (signErr) {
      setError(signErr.message)
      return
    }
    const ok = await isCurrentUserAdmin()
    if (!ok) {
      await supabase.auth.signOut()
      setError('This account is not authorized for admin access.')
      return
    }
    navigate('/admin', { replace: true })
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)
    setError(null)
    const redirectTo = `${window.location.origin}/admin/update-password`
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })
    setResetLoading(false)
    if (resetErr) {
      setError(resetErr.message)
      return
    }
    setResetSent(true)
  }

  if (checking) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Checking session…</p>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <p className="admin-eyebrow">Staff</p>
        <h1 className="admin-title">{forgotMode ? 'Reset password' : 'Sign in'}</h1>
        {forgotMode ? (
          <form className="admin-form" onSubmit={(e) => void handleForgotPassword(e)}>
            <label className="admin-label">
              Email
              <input
                className="admin-input"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {resetSent ? (
              <p className="admin-muted">If an account exists for that email, you will receive a reset link shortly. Check your inbox and spam folder.</p>
            ) : null}
            {error && <p className="admin-error">{error}</p>}
            <button className="admin-btn" type="submit" disabled={resetLoading || resetSent}>
              {resetLoading ? 'Sending…' : resetSent ? 'Link sent' : 'Send reset link'}
            </button>
            <button
              type="button"
              className="admin-text-link"
              onClick={() => {
                setForgotMode(false)
                setResetSent(false)
                setError(null)
              }}
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="admin-label">
              Email
              <input
                className="admin-input"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="admin-label">
              Password
              <input
                className="admin-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="admin-error">{error}</p>}
            <button className="admin-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <button type="button" className="admin-text-link" onClick={() => { setForgotMode(true); setError(null); setResetSent(false) }}>
              Forgot password?
            </button>
          </form>
        )}
        <Link to="/" className="admin-back">
          ← Back to site
        </Link>
      </div>
    </div>
  )
}
