'use client';

import { useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { initialBooks, initialLoans, statusStyles } from '@/lib/data';
import { UserIcon, BookIcon, SaveIcon, UndoIcon } from '@/components/icons';

const PAGE_SIZE = 3;

function formatDate(date) {
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default function KelolaPeminjamanPage() {
  const [loans, setLoans] = useState(initialLoans);
  const [studentName, setStudentName] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [bookQuery, setBookQuery] = useState('');
  const [showBookOptions, setShowBookOptions] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredBookOptions = useMemo(() => {
    if (!bookQuery) return initialBooks;
    return initialBooks.filter((b) => b.title.toLowerCase().includes(bookQuery.toLowerCase()));
  }, [bookQuery]);

  const filteredLoans = useMemo(() => {
    return loans.filter(
      (l) =>
        l.student.toLowerCase().includes(search.toLowerCase()) ||
        l.book.toLowerCase().includes(search.toLowerCase())
    );
  }, [loans, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLoans.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredLoans.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!studentName.trim() || !selectedBook) return;

    const today = new Date();
    const due = addDays(today, 7);
    const nextId = `#PJ-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(
      today.getDate()
    ).padStart(2, '0')}-${String(loans.length + 1).padStart(2, '0')}`;

    const newLoan = {
      id: nextId,
      student: studentName.trim(),
      class: '-',
      book: selectedBook,
      borrowedDate: formatDate(today),
      dueDate: formatDate(due),
      status: 'Dipinjam',
      returnedDate: null,
    };

    setLoans((prev) => [newLoan, ...prev]);
    setStudentName('');
    setSelectedBook('');
    setBookQuery('');
    setPage(1);
  }

  function handleReturn(id) {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id
          ? { ...loan, status: 'Selesai', returnedDate: formatDate(new Date()) }
          : loan
      )
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">
        <Header searchValue={search} onSearchChange={setSearch} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-50 pointer-events-none" />
          <h3 className="relative flex items-center gap-2 font-semibold text-gray-800 mb-5">
            <span className="text-brand text-xl leading-none">+</span> Catat Peminjaman Baru
          </h3>

          <form onSubmit={handleSubmit} className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Nama Siswa</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Masukkan nama lengkap siswa..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1.5">Pilih Buku</label>
              <div className="relative">
                <BookIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={selectedBook || bookQuery}
                  onChange={(e) => {
                    setBookQuery(e.target.value);
                    setSelectedBook('');
                    setShowBookOptions(true);
                  }}
                  onFocus={() => setShowBookOptions(true)}
                  onBlur={() => setTimeout(() => setShowBookOptions(false), 150)}
                  placeholder="Cari / Pilih judul buku..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
              {showBookOptions && filteredBookOptions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-md max-h-48 overflow-auto">
                  {filteredBookOptions.map((b) => (
                    <li key={b.code}>
                      <button
                        type="button"
                        onMouseDown={() => {
                          setSelectedBook(b.title);
                          setBookQuery('');
                          setShowBookOptions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {b.title}{' '}
                        <span className="text-gray-400 text-xs">· stok {b.stock}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              <SaveIcon className="w-4 h-4" />
              Simpan
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Daftar Peminjaman Aktif</h3>
          <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
            Filter ▾
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="font-medium px-5 py-3">ID Pinjam</th>
                <th className="font-medium px-5 py-3">Nama Peminjam &amp; Buku</th>
                <th className="font-medium px-5 py-3">Tgl Pinjam</th>
                <th className="font-medium px-5 py-3">Tenggat Waktu</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-50 last:border-0 align-top">
                  <td className="px-5 py-4 text-gray-400">{loan.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">
                      {loan.student} <span className="text-gray-400 font-normal">(Kelas {loan.class})</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <BookIcon className="w-3 h-3" /> {loan.book}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{loan.borrowedDate}</td>
                  <td className={`px-5 py-4 font-medium ${loan.status === 'Terlambat' ? 'text-red-500' : 'text-gray-600'}`}>
                    {loan.dueDate}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        statusStyles[loan.status] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {loan.status === 'Terlambat' && '⚠ '}
                      {loan.status === 'Selesai' && '✓ '}
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {loan.status === 'Selesai' ? (
                      <span className="text-xs text-gray-400">
                        Dikembalikan ({loan.returnedDate})
                      </span>
                    ) : (
                      <button
                        onClick={() => handleReturn(loan.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <UndoIcon className="w-3.5 h-3.5" />
                        Kembalikan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    Tidak ada data peminjaman yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-3 text-sm text-gray-500 border-t border-gray-100">
            <span>
              Menampilkan {filteredLoans.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, filteredLoans.length)} dari {filteredLoans.length} data
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                ‹
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
