'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon, BookIcon, LoanIcon, LogoutIcon } from './icons';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { href: '/kelola-buku', label: 'Kelola Buku', Icon: BookIcon },
  { href: '/kelola-peminjaman', label: 'Kelola Peminjaman', Icon: LoanIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  // State untuk mengontrol munculnya popup konfirmasi logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fungsi saat tombol keluar di sidebar diklik
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // Fungsi saat tombol "Ya, Keluar" di popup diklik
  const executeLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <>
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-xl">
            📖
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-gray-800 text-sm">Perpustakaan Digital</p>
            <p className="text-xs text-gray-400">SDN Cijambe 1</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogoutIcon className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* POPUP KONFIRMASI LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Keluar</h3>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari akun administrator?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={executeLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}