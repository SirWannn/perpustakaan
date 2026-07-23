'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon, BookIcon, LoanIcon, LogoutIcon } from './icons';
import Image from 'next/image';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { href: '/kelola-buku', label: 'Buku', Icon: BookIcon },
  { href: '/kelola-peminjaman', label: 'Pinjam', Icon: LoanIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const executeLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <>
      {/* 1. SIDEBAR DESKTOP (Laptop/PC) */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 z-10">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-50 mb-2">
          <div className="w-10 h-10 relative shrink-0">
  <Image 
    src="/logo.png" 
    alt="Logo SDN Cijambe 1" 
    fill 
    className="object-contain"
    sizes="40px"
  />
</div>
          <div className="leading-tight">
            <p className="font-semibold text-gray-800 text-sm">Perpustakaan</p>
            <p className="text-xs text-gray-400">SDN Cijambe 1</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-2">
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
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogoutIcon className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* 2. NAVIGASI BAWAH (HP/Mobile) - Diperbaiki agar pasti muncul */}
      <nav className="fixed inset-x-0 bottom-0 z-[90] flex h-16 w-full items-center justify-around bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] md:hidden">
        {menuItems.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full ${
                active ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex flex-col items-center justify-center gap-1 w-full h-full text-red-400 hover:text-red-500"
        >
          <LogoutIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Keluar</span>
        </button>
      </nav>

      {/* 3. POPUP KONFIRMASI KELUAR */}
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