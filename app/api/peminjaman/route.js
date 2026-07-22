import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mengambil semua data peminjaman (GET)
export async function GET() {
  try {
    const peminjaman = await prisma.peminjaman.findMany({
      include: { buku: true }, // Ambil juga detail buku yang dipinjam
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
    
    const peminjamanBaru = await prisma.peminjaman.create({
      data: {
        kodePinjam: body.kodePinjam,
        namaPeminjam: body.namaPeminjam,
        kelas: body.kelas, // <--- Tambahkan baris ini agar tersimpan
        bukuId: parseInt(body.bukuId),
        tenggatWaktu: new Date(body.tenggatWaktu),
      },
      include: { buku: true }
    });

    // Opsional: Kurangi stok buku
    await prisma.buku.update({
      where: { id: parseInt(body.bukuId) },
      data: { stok: { decrement: 1 } }
    });

    return NextResponse.json(peminjamanBaru, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan peminjaman" }, { status: 500 });
  }
}

// Menyelesaikan peminjaman / Pengembalian (PUT)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, bukuId } = body;

    const updatePinjam = await prisma.peminjaman.update({
      where: { id: Number(id) },
      data: {
        status: 'Selesai',
        tanggalKembali: new Date(),
      },
      include: { buku: true }
    });

    // Opsional: Kembalikan stok buku
    await prisma.buku.update({
      where: { id: Number(bukuId) },
      data: { stok: { increment: 1 } }
    });

    return NextResponse.json(updatePinjam, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memproses pengembalian" }, { status: 500 });
  }
}