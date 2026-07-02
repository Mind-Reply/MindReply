import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifyAdminToken(token: string): boolean {
  const secret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  try {
    const payload = Buffer.from(parts[0], 'base64').toString()
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    if (!crypto.timingSafeEqual(Buffer.from(parts[1]), Buffer.from(expectedSig))) return false

    const parsed = JSON.parse(payload)
    if (!parsed.admin || (parsed.exp && parsed.exp < Date.now())) return false
    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next()
  }

  if (
    request.nextUrl.pathname.startsWith('/api/admin') ||
    request.nextUrl.pathname.startsWith('/api/director') ||
    request.nextUrl.pathname.startsWith('/api/backend/connectors')
  ) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/director/:path*', '/api/backend/connectors/:path*'],
}
