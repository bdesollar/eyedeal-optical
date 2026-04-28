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
        <h1 className="admin-title">Sign in</h1>
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
        </form>
        <Link to="/" className="admin-back">
          ← Back to site
        </Link>
      </div>
    </div>
  )
}
