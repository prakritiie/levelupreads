'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { clearUser, getUser } from '@/utils/storage'
import type { AppUser } from '@/utils/storage'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [pathname])

  function handleLogout() {
    clearUser()
    setUser(null)
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold text-xl tracking-tight text-slate-900">
          levelupReads
        </Link>
        <nav className="flex items-center gap-3 text-sm text-slate-600">
          <Link href="/explore" className="hover:text-slate-900">Explore</Link>
          <Link href="/leaderboard" className="hover:text-slate-900">Leaderboard</Link>
          {user?.role === 'reader' && (
            <Link href="/reader/dashboard" className="hover:text-slate-900">Reader</Link>
          )}
          {user?.role === 'curator' && (
            <Link href="/curator/dashboard" className="hover:text-slate-900">Curator</Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          ) : (
            <Link href="/" className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
