import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handler untuk MENGAMBIL data buku (GET)
export async function GET() {
  try {
    const buku = await prisma.buku.findMany({
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(buku, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// Handler untuk MENAMBAH data buku (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    
    const bukuBaru = await prisma.buku.create({
      data: {
        kodeBuku: body.kodeBuku,
        judul: body.judul,
        penulis: body.penulis, 
        tahunTerbit: parseInt(body.tahunTerbit) || null,
        stok: parseInt(body.stok) || 0,
      }
    });

    return NextResponse.json(bukuBaru, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan buku" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, kodeBuku, judul, penulis, tahunTerbit, stok } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID Buku tidak ditemukan" }, { status: 400 });
    }

    const updatedBuku = await prisma.buku.update({
      where: { id: Number(id) },
      data: {
        kodeBuku,
        judul,
        penulis,
        tahunTerbit: parseInt(tahunTerbit) || null,
        stok: parseInt(stok) || 0,
      }
    });

    return NextResponse.json(updatedBuku, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate buku" }, { status: 500 });
  }
}

// Handler untuk HAPUS data buku (DELETE)
export async function DELETE(request) {
  try {
    // Ambil parameter id dari URL, misal: /api/buku?id=5
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID Buku diperlukan" }, { status: 400 });
    }

    await prisma.buku.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ message: "Buku berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus buku" }, { status: 500 });
  }
}