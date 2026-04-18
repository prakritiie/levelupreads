import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const dataPath = path.join(process.cwd(), 'src', 'lib', 'data', 'books.json')

async function readBooks() {
  const file = await fs.readFile(dataPath, 'utf-8')
  return JSON.parse(file) as Array<Record<string, unknown>>
}

async function writeBooks(data: Array<Record<string, unknown>>) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const books = await readBooks()
    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load books' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, author, genre, description, coverImage } = body
    if (!title || !author || !genre || !description || !coverImage) {
      return NextResponse.json({ error: 'Missing required book fields' }, { status: 400 })
    }

    const books = await readBooks()
    const newBook = {
      id: books.length > 0 ? Math.max(...books.map((book) => Number(book.id))) + 1 : 1,
      title,
      author,
      genre,
      description,
      coverImage,
      xpReward: Number(body.xpReward) || 40
    }

    await writeBooks([...books, newBook])
    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to save the book' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const bookId = Number(body.id)
    if (!bookId) {
      return NextResponse.json({ error: 'Missing book id' }, { status: 400 })
    }

    const books = await readBooks()
    const filtered = books.filter((book) => Number(book.id) !== bookId)
    await writeBooks(filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to delete the book' }, { status: 500 })
  }
}
