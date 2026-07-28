import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mengambil semua data peminjaman (GET)
export async function GET() {
  try {
    const peminjaman = await prisma.peminjaman.findMany({
      include: { buku: true },
      orderBy: { tanggalPinjam: 'desc' }
    });
    return NextResponse.json(peminjaman, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// Menambahkan data peminjaman baru (POST)
export async function POST(request) {
  try {
    const body = await request.json();

    const buku = await prisma.buku.findUnique({ 
      where: { id: parseInt(body.bukuId) } 
    });

    // 1. Simpan peminjaman baru
    const peminjamanBaru = await prisma.peminjaman.create({
      data: {
        kodePinjam: body.kodePinjam,
        namaPeminjam: body.namaPeminjam,
        kelas: body.kelas,
        bukuId: parseInt(body.bukuId),
        judulBukuSnapshot: buku?.judul, 
        tenggatWaktu: body.tenggatWaktu,
      },
      include: {
        buku: true
      }
    });

    // 2. PERBAIKAN: Kurangi stok buku 1 saat dipinjam
    if (buku) {
      await prisma.buku.update({
        where: { id: parseInt(body.bukuId) },
        data: { stok: { decrement: 1 } } // Catatan: Jika nama kolom Anda di database adalah jumlahBuku, ganti 'stok' menjadi 'jumlahBuku'
      });
    }

    return NextResponse.json(peminjamanBaru, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mencatat peminjaman" }, { status: 500 });
  }
}

// Menyelesaikan peminjaman / Pengembalian (PUT)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, bukuId } = body;

    // 1. PERBAIKAN: Cek dulu apakah statusnya sudah selesai
    const cekStatus = await prisma.peminjaman.findUnique({
      where: { id: Number(id) }
    });

    if (cekStatus.status === 'Selesai') {
      return NextResponse.json({ error: "Buku ini sudah dikembalikan" }, { status: 400 });
    }

    // 2. Update status menjadi Selesai
    const updatePinjam = await prisma.peminjaman.update({
      where: { id: Number(id) },
      data: {
        status: 'Selesai',
        tanggalKembali: new Date(),
      },
      include: { buku: true }
    });

    // 3. Tambahkan kembali stok buku
    await prisma.buku.update({
      where: { id: Number(bukuId) },
      data: { stok: { increment: 1 } } // Catatan: Sesuaikan 'stok' dengan nama kolom di database jika berbeda
    });

    return NextResponse.json(updatePinjam, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memproses pengembalian" }, { status: 500 });
  }
}