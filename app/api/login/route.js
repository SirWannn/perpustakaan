import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Dapatkan IP dan Browser (User-Agent) bawaan dari request
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rawUserAgent = request.headers.get('user-agent') || 'Perangkat Tidak Dikenal';
    
    // Sederhanakan nama perangkat agar rapi di tabel (ambil 30 huruf pertama)
    const perangkat = rawUserAgent.split(')')[0] + ')' || rawUserAgent.substring(0, 30);

    let loginSuccess = false;

    // Jalur Bypass Admin
    if (username === 'adminperpustakaan' && password === 'sdncijambe01hebat') {
      loginSuccess = true;
      cookies().set('auth_token', 'admin_logged_in', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
    } else {
      // Pengecekan Database
      const user = await prisma.user.findFirst({
        where: {
          OR: [ { nama: username }, { email: username } ]
        }
      });

      if (user && user.password === password) {
        loginSuccess = true;
        cookies().set('auth_token', 'user_logged_in', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24,
          path: '/',
        });
      }
    }

    // --- PROSES PENCATATAN KE DATABASE ---
    await prisma.riwayatLogin.create({
      data: {
        perangkat: perangkat.length > 50 ? perangkat.substring(0, 47) + '...' : perangkat,
        ip: ip,
        status: loginSuccess ? 'Berhasil' : 'Gagal'
      }
    });

    if (loginSuccess) {
      return NextResponse.json({ message: "Login berhasil" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Username atau password salah!" }, { status: 401 });
    }

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}