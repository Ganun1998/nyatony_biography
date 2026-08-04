'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { authApi, setToken } from '@/lib/api'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { token, user } = await authApi.login(email, password)

      if (user.role !== 'admin') {
        setError('Access denied. Admin accounts only.')
        setLoading(false)
        return
      }

      setToken(token)
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-secondary dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(201,162,39,0.12)', border: '2px solid rgba(201,162,39,0.3)' }}
          >
            <Lock className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-text dark:text-white">Admin Login</h1>
          <p className="font-inter text-sm text-text-muted mt-1">Nyatony Biography &mdash; Secure Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-card border border-gold/10">
          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@nyatony.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm text-text dark:text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="font-inter text-sm font-semibold text-text dark:text-white mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-dark-border bg-background-secondary dark:bg-dark-bg font-inter text-sm text-text dark:text-white focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 rounded-xl">
                <span className="text-red-500 text-xs mt-0.5">⚠</span>
                <p className="font-inter text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-dark-border text-center">
            <p className="font-inter text-xs text-text-muted">
              Default credentials: <span className="text-gold font-semibold">admin@nyatony.com</span>
            </p>
            <p className="font-inter text-xs text-text-light mt-0.5">
              Run <code className="bg-gray-100 dark:bg-dark-bg px-1.5 py-0.5 rounded text-xs">npm run seed</code> in /backend to create the admin user
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
