import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sekarang = new Date();
    
    // 1. Hitung Total Buku
    const totalBuku = await prisma.buku.count();

    // 2. Hitung Total Peminjam (Unik berdasarkan nama)
    const uniquePeminjam = await prisma.peminjaman.findMany({
      select: { namaPeminjam: true },
      distinct: ['namaPeminjam'],
    });
    const totalPeminjam = uniquePeminjam.length;

    // 3. Hitung Peminjaman Aktif & Terlambat
    const dipinjam = await prisma.peminjaman.count({
      where: { status: { not: 'Selesai' } }
    });
    
    const terlambat = await prisma.peminjaman.count({
      where: {
        status: { not: 'Selesai' },
        tenggatWaktu: { lt: sekarang }
      }
    });

    // 4. Ambil 3 Peminjaman Terbaru
    const recentLoansData = await prisma.peminjaman.findMany({
      take: 3,
      orderBy: { tanggalPinjam: 'desc' },
      include: { buku: true }
    });

    // 5. Hitung Tren Peminjaman (6 Hari Terakhir)
    const trend = [];
    const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0); // Mulai dari jam 00:00
      
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1); // Sampai jam 00:00 besoknya

      const count = await prisma.peminjaman.count({
        where: {
          tanggalPinjam: {
            gte: d,
            lt: nextD
          }
        }
      });

      trend.push({
        label: namaHari[d.getDay()],
        value: count
      });
    }

    return NextResponse.json({
      stats: { totalBuku, totalPeminjam, dipinjam, terlambat },
      recentLoans: recentLoansData,
      trend
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ error: "Gagal memuat data dashboard" }, { status: 500 });
  }
}