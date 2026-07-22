import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Tarik 10 riwayat terakhir, urutkan dari yang paling baru
    const riwayat = await prisma.riwayatLogin.findMany({
      take: 10,
      orderBy: { waktu: 'desc' }
    });
    return NextResponse.json(riwayat, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data riwayat" }, { status: 500 });
  }
}