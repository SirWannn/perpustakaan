'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import { BookIcon } from '@/components/icons';

const trend = [
  { label: 'Sen', value: 45 },
  { label: 'Sel', value: 68 },
  { label: 'Rab', value: 38 },
  { label: 'Kam', value: 92 },
  { label: 'Jum', value: 58 },
  { label: 'Sab', value: 80 },
];

const recentLoans = [
  {
    title: 'Petualangan Tata Surya',
    borrower: 'Budi (Kelas 4)',
    time: 'Hari ini',
    color: 'bg-blue-100',
  },
  {
    title: 'Kancil dan Buaya',
    borrower: 'Siti (Kelas 2)',
    time: 'Kemarin',
    color: 'bg-green-100',
  },
  {
    title: 'Matematika Menyenangkan',
    borrower: 'Andi (Kelas 5)',
    time: '2 Hari lalu',
    color: 'bg-gray-100',
  },
];

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const maxTrend = Math.max(...trend.map((t) => t.value));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">
        <Header searchValue={search} onSearchChange={setSearch} />

        <h2 className="text-2xl font-bold text-gray-800">Selamat Datang kembali!</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Berikut adalah ringkasan aktivitas perpustakaan hari ini.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon="📄"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            badge="+12 Minggu ini"
            badgeColor="bg-green-100 text-green-700"
            label="Total Buku"
            value="1,245"
          />
          <StatCard
            icon="👥"
            iconBg="bg-green-100"
            iconColor="text-green-600"
            badge="Aktif"
            badgeColor="bg-gray-100 text-gray-500"
            label="Total Peminjam"
            value="312"
          />
          <StatCard
            icon="↩️"
            iconBg="bg-amber-100"
            iconColor="text-amber-700"
            badge="5 Terlambat"
            badgeColor="bg-red-100 text-red-600"
            label="Buku yang Dipinjam"
            value="48"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Tren Peminjaman</h3>
              <button className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50">
                Bulan Ini ▾
              </button>
            </div>
            <div className="flex items-end justify-between gap-3 h-52 px-2">
              {trend.map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full max-w-10 rounded-t-md bg-blue-200 hover:bg-brand transition-colors"
                    style={{ height: `${(t.value / maxTrend) * 160}px` }}
                    title={`${t.label}: ${t.value} peminjaman`}
                  />
                  <span className="text-xs text-gray-400">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Peminjaman Terbaru</h3>
              <a href="/kelola-peminjaman" className="text-xs text-brand font-medium hover:underline">
                Lihat Semua
              </a>
            </div>
            <ul className="space-y-4">
              {recentLoans.map((loan) => (
                <li key={loan.title} className="flex items-start gap-3">
                  <div className={`w-9 h-11 rounded-md ${loan.color} flex items-center justify-center text-gray-500 shrink-0`}>
                    <BookIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{loan.title}</p>
                    <p className="text-xs text-gray-500">Dipinjam oleh: {loan.borrower}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{loan.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
