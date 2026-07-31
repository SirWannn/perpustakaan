import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Ambil data admin pertama (GET)
export async function GET() {
  try {
    const admin = await prisma.user.findFirst();
    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// Update data admin (PUT)
export async function PUT(request) {
  try {
    const body = await request.json();
    
    // Asumsi kita mengupdate user pertama (Admin)
    const admin = await prisma.user.findFirst();
    
    if (!admin) {
        return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    const updateAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: {
        nama: body.nama,
        email: body.email,
        // Tambahkan kolom lain di sini jika kamu sudah mengupdate schema.prisma
        // telepon: body.telepon,
      }
    });

    return NextResponse.json(updateAdmin, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update profil" }, { status: 500 });
  }
}