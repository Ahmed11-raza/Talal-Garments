import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/account/login?callbackUrl=/admin', request.url))
    }
    
    // @ts-ignore - role is injected via callbacks in auth.ts
    if (session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect /account routes (except login/register)
  if (request.nextUrl.pathname.startsWith('/account') && 
      !request.nextUrl.pathname.startsWith('/account/login') && 
      !request.nextUrl.pathname.startsWith('/account/register')) {
    if (!session) {
      return NextResponse.redirect(new URL('/account/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
