import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const dataPath = path.join(process.cwd(), 'src', 'lib', 'data', 'challenges.json')

export async function GET() {
  try {
    const file = await fs.readFile(dataPath, 'utf-8')
    const challenges = JSON.parse(file)
    return NextResponse.json(challenges)
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load challenges' }, { status: 500 })
  }
}
