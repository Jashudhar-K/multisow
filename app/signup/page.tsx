'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Signup failed')
        setLoading(false)
        return
      }

      // Auto sign-in after signup
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      setLoading(false)

      if (signInRes?.error) {
        setError('Account created — please sign in manually')
        router.push('/login')
        return
      }

      router.push('/onboarding')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
        className="w-full max-w-sm space-y-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
            <Icon name="agriculture" size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="text-sm text-text-muted">Start designing your multi-tier farm</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <Icon name="warning" size={16} />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-text-secondary">Name</label>
            <div className="relative">
              <Icon name="person" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-overlay border border-border-subtle text-text-primary placeholder:text-text-disabled text-sm focus:outline-none input-glow transition-all"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-text-secondary">Email</label>
            <div className="relative">
              <Icon name="mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-overlay border border-border-subtle text-text-primary placeholder:text-text-disabled text-sm focus:outline-none input-glow transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-text-secondary">Password</label>
            <div className="relative">
              <Icon name="lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-overlay border border-border-subtle text-text-primary placeholder:text-text-disabled text-sm focus:outline-none input-glow transition-all"
                placeholder="Min. 8 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-press w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
