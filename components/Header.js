import Link from 'next/link';

export default function Header({ searchValue, onSearchChange, placeholder = "Cari...", hideSearch = false }) {
  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      {/* min-w-max mencegah teks patah ke baris baru */}
      <h1 className="text-xl font-bold text-gray-800 min-w-max">SDN Cijambe 1</h1>
      
      <div className="flex items-center justify-end gap-3 w-full">
        {!hideSearch && (
          <div className="relative w-full max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-100 shadow-sm rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        )}
        
        <Link href="/profil" className="shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-semibold flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
            A
          </div>
        </Link>
      </div>
    </header>
  );
}