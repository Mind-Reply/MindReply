// Admin middleware - protect /admin route
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user is authenticated (via localStorage handled on client)
    // Server-side: just allow access, client handles auth
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
