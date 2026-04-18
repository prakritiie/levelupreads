'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import BookCard, { BookItem } from '@/components/BookCard'
import { getUser, saveUser, AppUser } from '@/utils/storage'
import { addXP, calculateLevel } from '@/utils/xp'
import { getXpProgress } from '@/utils/helpers'

type Challenge = {
  id: number
  title: string
  description: string
  xpReward: number
  deadline: string
}

export default function ReaderDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null)
  const [books, setBooks] = useState<BookItem[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([])
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || currentUser.role !== 'reader') {
      router.push('/')
      return
    }
    setUser(currentUser)

    Promise.all([fetch('/api/books'), fetch('/api/challenges')])
      .then(async ([bookRes, challengeRes]) => {
        const bookData = await bookRes.json()
        const challengeData = await challengeRes.json()
        setBooks(bookData)
        setChallenges(challengeData)
      })
      .catch(() => setError('Unable to load reader data.'))
      .finally(() => setLoading(false))
  }, [router])

  const totalChallenges = challenges.length
  const totalBooks = books.length
  const level = user ? calculateLevel(user.xp) : 0
  const progress = user ? getXpProgress(user.xp) : 0

  function updateUserXp(newXp: number) {
    if (!user) return
    const updated = { ...user, xp: newXp }
    setUser(updated)
    saveUser(updated)
  }

  function handleChallengeJoin(id: number) {
    if (joinedChallenges.includes(id)) return
    const challenge = challenges.find((item) => item.id === id)
    if (!challenge) return

    fetch('/api/challenges/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: id })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.xpReward) {
          const newXp = addXP(user?.xp ?? 0, result.xpReward)
          updateUserXp(newXp)
          setJoinedChallenges((current) => [...current, id])
          setActionMessage(`Joined challenge and earned ${result.xpReward} XP!`)
        }
      })
      .catch(() => setActionMessage('Unable to join challenge right now.'))
  }

  function handleFinishBook(book: BookItem) {
    const newXp = addXP(user?.xp ?? 0, book.xpReward)
    updateUserXp(newXp)
    setActionMessage(`Finished ${book.title} and earned ${book.xpReward} XP!`)
  }

  const recommendedBooks = useMemo(() => books.slice(0, 3), [books])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Reader Dashboard</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {user?.name}</h1>
              </div>
              <div className="rounded-lg bg-amber-50 px-5 py-3 text-sm text-amber-900">
                <p className="font-semibold">Current XP</p>
                <p className="mt-1 text-2xl font-bold">{user?.xp.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total XP</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{user?.xp ?? 0}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Challenges</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{totalChallenges}</p>
                <p className="mt-1 text-xs text-slate-600">Available now</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Books</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{totalBooks}</p>
                <p className="mt-1 text-xs text-slate-600">Titles ready</p>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">XP Progress</p>
                  <p className="mt-2 text-3xl font-bold text-amber-900">Level {level}</p>
                </div>
                <p className="text-sm text-amber-700">{progress}% to next</p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-200">
                <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {actionMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{actionMessage}</div>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Continue reading</h2>
              {loading ? (
                <p className="text-slate-600">Loading your books…</p>
              ) : books.length === 0 ? (
                <p className="text-slate-600">No books found.</p>
              ) : (
                <div className="space-y-4">
                  {books.slice(0, 2).map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      action={
                        <button
                          type="button"
                          onClick={() => handleFinishBook(book)}
                          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 whitespace-nowrap"
                        >
                          Finish
                        </button>
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="h-fit space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Recommended</p>
              <div className="mt-6 space-y-3">
                {recommendedBooks.map((book) => (
                  <div key={book.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                    <p className="font-semibold text-slate-900 line-clamp-2">{book.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{book.author}</p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded font-semibold">+{book.xpReward} XP</span>
                      <a href="/explore" className="text-xs font-semibold text-slate-600 hover:text-slate-900">View</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Challenges</p>
              <div className="mt-6 space-y-3">
                {loading ? (
                  <p className="text-xs text-slate-600">Loading…</p>
                ) : challenges.length === 0 ? (
                  <p className="text-xs text-slate-600">No challenges.</p>
                ) : (
                  challenges.slice(0, 4).map((challenge) => (
                    <div key={challenge.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900 text-sm line-clamp-1">{challenge.title}</p>
                          <p className="text-xs text-slate-500 mt-1">+{challenge.xpReward} XP</p>
                        </div>
                        {!joinedChallenges.includes(challenge.id) && (
                          <button
                            type="button"
                            onClick={() => handleChallengeJoin(challenge.id)}
                            className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white transition hover:bg-slate-700 whitespace-nowrap flex-shrink-0"
                          >
                            Join
                          </button>
                        )}
                        {joinedChallenges.includes(challenge.id) && (
                          <span className="text-xs font-semibold text-emerald-600 flex-shrink-0">Joined ✓</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
