import { getAccessToken } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await getAccessToken()
    console.log('[/api/auth/token] Got access token:', result?.accessToken ? 'YES' : 'NO')
    return NextResponse.json({ accessToken: result?.accessToken || null })
  } catch (error) {
    console.error('[/api/auth/token] Failed to get access token:', error)
    return NextResponse.json({ accessToken: null }, { status: 401 })
  }
}
