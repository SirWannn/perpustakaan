import { NextResponse } from 'next/server';

export function middleware(request) {
  // Cek apakah ada cookie tanda sudah login
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Jika user BELUM login dan mencoba masuk ke halaman selain login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika user SUDAH login tapi malah membuka root ('/') atau halaman '/login'
  if (token && (pathname === '/login' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi ini menentukan rute URL mana saja yang akan dicegat oleh middleware
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/kelola-buku/:path*', '/kelola-peminjaman/:path*'],
};