// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const token = {
  name: process.env.ADMIN_TOEKN_NAME || '',
  value: process.env.ADMIN_TOEKN_VALUE || '',
}
// main
export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname
  // handle prompt
  // if (currentPath === '/api/prompt') {
  //   const domain = request.nextUrl.hostname
  //   const method = request.method
  //   const params = request.nextUrl.searchParams

  //   console.log('domain::', domain)
  //   console.log('method::', method)
  //   console.log('params::', params)
  // }

  // handle post
  // if (currentPath === '/api/post') {
  //   const loginToken = request.cookies.get(token.name) || ''
  //   console.log('token:', loginToken)
  // }

  // const isAuthenticated = !!authToken
  // if (isAuthenticated) {
  //   if (request.url.includes('auth')) {
  //     return NextResponse.redirect(new URL('/translate', request.url))
  //   }
  //   return NextResponse.next()
  // }
  // if (!request.url.includes('auth')) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/auth';
  //   return NextResponse.redirect(url)
  // }
}

// config
export const config = {
  matcher: [
    /*
     * 匹配所有的路径除了以这些作为开头的：
     * - api/login (API routes)
     * - auth (Page auth)
     * - images(Pubulic images)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/login|images|_next/static|_next/image|favicon.ico).*)',
  ],
}
