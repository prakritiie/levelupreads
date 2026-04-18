'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import BookCard, { BookItem } from '@/components/BookCard'
import { getUser, saveUser, AppUser } from '@/utils/storage'

const defaultFormState = {
  title: '',
  author: '',
  genre: '',
  description: '',
  coverImage: '',
  xpReward: '40'
}

export default function CuratorDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null)
  const [books, setBooks] = useState<BookItem[]>([])
  const [form, setForm] = useState(defaultFormState)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || currentUser.role !== 'curator') {
      router.push('/')
      return
    }
    setUser(currentUser)
    loadBooks()
  }, [router])

  async function loadBooks() {
    setLoading(true)
    try {
      const response = await fetch('/api/books')
      const data = await response.json()
      setBooks(data)
    } catch {
      setError('Unable to load books.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!form.title || !form.author || !form.genre || !form.description || !form.coverImage) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          xpReward: Number(form.xpReward)
        })
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error || 'Unable to save the book.')
        return
      }
      setForm(defaultFormState)
      setMessage('Book added successfully.')
      loadBooks()
    } catch {
      setError('Unable to add the book.')
    }
  }

  async function handleDeleteBook(bookId: number) {
    try {
      await fetch('/api/books', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookId })
      })
      setMessage('Book deleted successfully.')
      loadBooks()
    } catch {
      setError('Unable to delete the book.')
    }
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_0.7fr]">
          <section className="rounded-[3rem] bg-white p-10 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Curator Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Manage books and content</h1>
              </div>
              <div className="rounded-3xl bg-slate-100 px-5 py-4 text-sm text-slate-700">
                <p className="font-semibold">Books available</p>
                <p className="mt-2 text-2xl text-slate-900">{books.length}</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {message ? <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-slate-800">{message}</div> : null}
              {error ? <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-slate-800">{error}</div> : null}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Add a new book</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={form.title}
                      onChange={(event) => handleChange('title', event.target.value)}
                      placeholder="Title"
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    />
                    <input
                      value={form.author}
                      onChange={(event) => handleChange('author', event.target.value)}
                      placeholder="Author"
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={form.genre}
                      onChange={(event) => handleChange('genre', event.target.value)}
                      placeholder="Genre"
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    />
                    <input
                      value={form.coverImage}
                      onChange={(event) => handleChange('coverImage', event.target.value)}
                      placeholder="Cover image URL"
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    />
                  </div>
                  <textarea
                    value={form.description}
                    onChange={(event) => handleChange('description', event.target.value)}
                    placeholder="Description"
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                  />
                  <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                    <input
                      value={form.xpReward}
                      onChange={(event) => handleChange('xpReward', event.target.value)}
                      placeholder="XP reward"
                      type="number"
                      min={1}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-400"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Add Book
                    </button>
                  </div>
                </form>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Your catalog</h2>
                {loading ? (
                  <p className="mt-4 text-slate-600">Loading books…</p>
                ) : books.length === 0 ? (
                  <p className="mt-4 text-slate-600">No books to show.</p>
                ) : (
                  <div className="mt-6 space-y-3">
                    {books.map((book) => (
                      <div key={book.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">{book.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{book.author}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteBook(book.id)}
                            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
