import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const dataPath = path.join(process.cwd(), 'src', 'lib', 'data', 'challenges.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { challengeId } = body
    const file = await fs.readFile(dataPath, 'utf-8')
    const challenges = JSON.parse(file) as Array<{ id: number; xpReward: number }>
    const challenge = challenges.find((item) => item.id === Number(challengeId))
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, xpReward: challenge.xpReward, challengeId: challenge.id })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to join challenge' }, { status: 500 })
  }
}
