'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import BookCard, { BookItem } from '@/components/BookCard'

const genres = ['All', 'Self Help', 'Fiction', 'Personal Growth']

export default function ExplorePage() {
  const [books, setBooks] = useState<BookItem[]>([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => setError('Unable to load books.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = [book.title, book.author, book.genre]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesGenre = genre === 'All' || book.genre === genre
      return matchesSearch && matchesGenre
    })
  }, [books, search, genre])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Explore books</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Find your next level-up read.</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Search books by title, author, or genre. Build reading streaks and collect XP for every book you choose.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-[1.6fr_0.9fr]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for books, authors, genre..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
              />
              <select
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
              >
                {genres.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <section className="grid gap-6">
            {loading ? (
              <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">Loading books…</div>
            ) : error ? (
              <div className="rounded-2xl bg-white p-8 text-center text-rose-500 shadow-sm">{error}</div>
            ) : filteredBooks.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">No books available.</div>
            ) : (
              <div className="grid gap-4">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
