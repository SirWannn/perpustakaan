'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import { BookIcon } from '@/components/icons';

export const dynamic = 'force-dynamic';

// Fungsi untuk menghitung jarak waktu menjadi "Hari ini", "Kemarin", dll.
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  
  // Reset jam agar perhitungan murni berdasarkan hari
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(today - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  return `${diffDays} Hari lalu`;
}

const colors = ['bg-blue-100', 'bg-green-100', 'bg-gray-100', 'bg-amber-100'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Gagal load dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Hindari error jika trend belum load
  const trend = data?.trend || [];
  const maxTrend = trend.length > 0 ? Math.max(...trend.map((t) => t.value)) : 1;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-4 md:px-10 py-6 md:py-8 pb-24 md:pb-8 max-w-6xl w-full">
        {/* Menyembunyikan kolom pencarian khusus di halaman ini */}
        <Header hideSearch={true} />

        <h2 className="text-2xl font-bold text-gray-800">Selamat Datang kembali!</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Berikut adalah ringkasan aktivitas perpustakaan hari ini.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon="📄"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            badge={isLoading ? "..." : "Terdaftar"}
            badgeColor="bg-blue-50 text-blue-700"
            label="Total Buku"
            value={isLoading ? "..." : data?.stats?.totalBuku}
          />
          <StatCard
            icon="👥"
            iconBg="bg-green-100"
            iconColor="text-green-600"
            badge="Peminjam Aktif"
            badgeColor="bg-gray-100 text-gray-500"
            label="Total Peminjam"
            value={isLoading ? "..." : data?.stats?.totalPeminjam}
          />
          <StatCard
            icon="↩️"
            iconBg="bg-amber-100"
            iconColor="text-amber-700"
            badge={isLoading ? "..." : `${data?.stats?.terlambat} Terlambat`}
            badgeColor="bg-red-100 text-red-600"
            label="Buku yang Dipinjam"
            value={isLoading ? "..." : data?.stats?.dipinjam}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* TREN PEMINJAMAN */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Tren Peminjaman (6 Hari Terakhir)</h3>
            </div>
            
            <div className="flex items-end justify-between gap-3 h-52 px-2">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Memuat grafik...
                </div>
              ) : (
                trend.map((t) => (
                  <div key={t.label} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full max-w-10 rounded-t-md bg-blue-200 hover:bg-brand transition-colors"
                      // Minimal height 4px agar tetap terlihat meski nilainya 0
                      style={{ height: `${Math.max((t.value / (maxTrend || 1)) * 160, 4)}px` }}
                      title={`${t.label}: ${t.value} peminjaman`}
                    />
                    <span className="text-xs text-gray-400 font-medium">{t.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PEMINJAMAN TERBARU */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Peminjaman Terbaru</h3>
              <a href="/kelola-peminjaman" className="text-xs text-brand font-medium hover:underline">
                Lihat Semua
              </a>
            </div>
            <ul className="space-y-4 flex-1">
              {isLoading ? (
                <li className="text-sm text-gray-400 text-center py-4">Memuat data...</li>
              ) : data?.recentLoans?.length === 0 ? (
                <li className="text-sm text-gray-400 text-center py-4">Belum ada peminjaman.</li>
              ) : (
                data?.recentLoans?.map((loan, index) => (
                  <li key={loan.id} className="flex items-start gap-3">
                    <div className={`w-9 h-11 rounded-md ${colors[index % colors.length]} flex items-center justify-center text-gray-500 shrink-0`}>
                      <BookIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{loan.judulBukuSnapshot || loan.buku?.judul || 'Buku Dihapus'}</p>
                      <p className="text-xs text-gray-500 truncate">Oleh: {loan.namaPeminjam}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {getRelativeTime(loan.tanggalPinjam)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
          
        </div>
      </main>
    </div>
  );
}