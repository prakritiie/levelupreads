'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { saveUser, getUser, AppUser } from '@/utils/storage'
import { calculateLevel } from '@/utils/xp'

const roleOptions = [
  { value: 'reader', label: 'Reader' },
  { value: 'curator', label: 'Curator' }
] as const

export default function HomePage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'reader' | 'curator'>('reader')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  function handleLogin() {
    setError('')
    setIsLoading(true)
    try {
      const demoUser: AppUser = {
        id: selectedRole === 'reader' ? 'reader-1' : 'curator-1',
        name: selectedRole === 'reader' ? 'Demo Reader' : 'Demo Curator',
        role: selectedRole,
        xp: selectedRole === 'reader' ? 120 : 80
      }
      saveUser(demoUser)
      setUser(demoUser)
      router.push(selectedRole === 'reader' ? '/reader/dashboard' : '/curator/dashboard')
    } catch (err) {
      setError('Unable to save the demo profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-7 rounded-[3rem] bg-white p-10 shadow-soft">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <p className="uppercase tracking-[0.32em]">Where Every Chapter Unlocks a New Achievement</p>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                LevelUpReads: Read, Earn, and Lead the community.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A gamified reading platform for readers and curators. Explore books, join challenges, and earn XP as you progress.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Members</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">23.1k+</p>
                <p className="mt-2 text-sm text-slate-600">happy readers</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Challenges</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">50+</p>
                <p className="mt-2 text-sm text-slate-600">goals and badges</p>
              </div>
            </div>
          </div>
          <div className="space-y-6 rounded-[3rem] bg-slate-900 p-10 text-white shadow-soft">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Start your demo</p>
              <h2 className="text-3xl font-semibold">Quick Login</h2>
              <p className="text-sm leading-6 text-slate-300">
                Pick a role and simulate a login experience using local storage. No real auth needed yet.
              </p>
            </div>
            <div className="space-y-4">
              <label className="block text-sm uppercase tracking-[0.24em] text-slate-300">Role</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedRole(option.value)}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${
                      selectedRole === option.value
                        ? 'border-amber-300 bg-white/10 text-white'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-sm font-semibold">{option.label}</p>
                    <p className="mt-1 text-xs text-slate-400">Demo access</p>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full rounded-3xl bg-amber-400 px-5 py-4 text-base font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Logging in…' : user ? 'Continue with saved demo' : 'Login as demo user'}
            </button>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
              <p>
                Use the Reader dashboard to explore books and challenges. Use the Curator dashboard to manage titles.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Note: This is a local demo. Data is read from JSON and user state is stored in localStorage.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
