import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Ambil cookie user_level
  const userLevel = request.cookies.get('user_level')?.value

  // Proteksi Route Admin
  if (pathname.startsWith('/admin')) {
    // Jika tidak ada level atau bukan Admin, lempar ke member/login
    if (!userLevel || userLevel !== 'Admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/member' // Sesuai permintaan: direct ke halaman member
      return NextResponse.redirect(url)
    }
  }

  // Proteksi Route Member (Opsional: Member tidak boleh ke login jika sudah login)
  if (pathname.startsWith('/member') && !userLevel) {
     const url = request.nextUrl.clone()
     url.pathname = '/auth/login'
     return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Konfigurasi route mana saja yang akan diproses oleh middleware
export const config = {
  matcher: ['/admin/:path*', '/member/:path*'],
}
