import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const dataPath = path.join(process.cwd(), 'src', 'lib', 'data', 'users.json')

export async function GET() {
  try {
    const file = await fs.readFile(dataPath, 'utf-8')
    const users = JSON.parse(file) as Array<{ xp: number }>
    const sorted = users.sort((a, b) => b.xp - a.xp)
    return NextResponse.json(sorted)
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load leaderboard' }, { status: 500 })
  }
}
