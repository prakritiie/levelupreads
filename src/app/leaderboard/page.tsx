'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import LeaderboardTable from '@/components/LeaderboardTable'
import { getUser } from '@/utils/storage'
import { mergeUserList } from '@/utils/helpers'

type LeaderboardUser = {
  id: number | string
  name: string
  xp: number
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        const currentUser = getUser()
        const userList = data as LeaderboardUser[]
        if (currentUser) {
          const merged = mergeUserList(userList, currentUser)
          setUsers(merged)
        } else {
          setUsers(userList)
        }
      })
      .catch(() => setError('Unable to load leaderboard.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Leaderboard</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">See who's climbing the ranks.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">The leaderboard shows top users sorted by XP. Your demo profile is included if you're logged in.</p>
          <div className="mt-8 space-y-6">
            {loading ? (
              <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-600 shadow-sm">Loading leaderboard…</div>
            ) : error ? (
              <div className="rounded-lg bg-rose-50 p-8 text-center text-rose-600 shadow-sm">{error}</div>
            ) : (
              <LeaderboardTable users={users} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
