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