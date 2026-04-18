'use client'

import type { ReactNode } from 'react'

export type BookItem = {
  id: number
  title: string
  author: string
  genre: string
  description: string
  coverImage: string
  xpReward: number
}

type Props = {
  book: BookItem
  action?: ReactNode
}

export default function BookCard({ book, action }: Props) {
  // Generate SVG book cover as fallback
  const bookCoverSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='160' viewBox='0 0 120 160'%3E%3Crect fill='%232d3748' width='120' height='160'/%3E%3Crect fill='%234a5568' x='8' y='8' width='104' height='144'/%3E%3Ctext x='60' y='80' font-size='14' fill='white' text-anchor='middle' font-weight='bold' dominant-baseline='middle' font-family='sans-serif'%3E${encodeURIComponent(book.title.slice(0, 12))}%3C/text%3E%3C/svg%3E`

  const image = book.coverImage && book.coverImage.startsWith('http') ? book.coverImage : bookCoverSvg

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        <div className="flex-shrink-0">
          <div className="h-40 w-28 overflow-hidden rounded-xl bg-slate-200">
            <img
              src={image}
              alt={book.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = bookCoverSvg
              }}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{book.genre}</p>
            <h3 className="mt-2 text-base font-semibold text-slate-900 line-clamp-2">{book.title}</h3>
            <p className="mt-1 text-sm text-slate-600">by {book.author}</p>
            <p className="mt-2 text-sm leading-5 text-slate-600 line-clamp-2">{book.description}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              +{book.xpReward} XP
            </span>
            {action ? <div className="flex-shrink-0">{action}</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
