// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export async function GET() {
//   cookies().delete('auth_token');
//   return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL));
// }

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  // Hapus cookie
  cookies().delete('auth_token');
  
  // Arahkan kembali ke halaman login
  return NextResponse.redirect(new URL('/login', request.url));
}