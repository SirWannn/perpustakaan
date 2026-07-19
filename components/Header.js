'use client';

import { SearchIcon, BellIcon, HelpIcon } from './icons';

export default function Header({ searchValue = '', onSearchChange }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <h1 className="text-lg md:text-xl font-bold text-gray-800">SDN Cijambe 1</h1>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Cari buku atau siswa..."
            className="pl-9 pr-4 py-2 w-56 md:w-64 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <button
          type="button"
          aria-label="Notifikasi"
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <BellIcon className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          aria-label="Bantuan"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <HelpIcon className="w-5 h-5 text-gray-500" />
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-sm font-semibold select-none">
          A
        </div>
      </div>
    </div>
  );
}
