import { NextResponse } from 'next/server'

export async function GET() {
  console.log('[API] Health check requested')
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}