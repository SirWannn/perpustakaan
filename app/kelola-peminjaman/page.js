'use client';

import { useMemo, useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { statusStyles } from '@/lib/data'; 
import { UserIcon, BookIcon, SaveIcon, UndoIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

const PAGE_SIZE = 5;

// Fungsi format tanggal untuk tampilan
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function KelolaPeminjamanPage() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]); 
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState(''); 
  const [selectedBook, setSelectedBook] = useState({ id: null, title: '' });
  const [bookQuery, setBookQuery] = useState('');
  const [showBookOptions, setShowBookOptions] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Popups
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [returnConfirm, setReturnConfirm] = useState({ show: false, loanData: null });

  // Fetch Data Peminjaman & Data Buku
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resLoans = await fetch('/api/peminjaman');
        const dataLoans = await resLoans.json();
        setLoans(dataLoans);

        const resBooks = await fetch('/api/buku');
        const dataBooks = await resBooks.json();
        setBooks(dataBooks);
      } catch (error) {
        console.error("Gagal load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // PENINGKATAN: Filter pencarian buku berdasarkan Judul ATAU Kode Buku
  const filteredBookOptions = useMemo(() => {
    if (!bookQuery) return books.filter(b => b.stok > 0); 
    const query = bookQuery.toLowerCase();
    
    return books.filter((b) => {
      const judulMatch = b.judul?.toLowerCase().includes(query);
      const kodeMatch = b.kodeBuku?.toLowerCase().includes(query);
      return (judulMatch || kodeMatch) && b.stok > 0;
    });
  }, [bookQuery, books]);

  const filteredLoans = useMemo(() => {
    return loans.filter(
      (l) =>
        l.namaPeminjam.toLowerCase().includes(search.toLowerCase()) ||
        (l.kelas && l.kelas.toLowerCase().includes(search.toLowerCase())) ||
        l.buku.judul.toLowerCase().includes(search.toLowerCase()) ||
        l.kodePinjam.toLowerCase().includes(search.toLowerCase())
    );
  }, [loans, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLoans.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredLoans.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!studentName.trim() || !studentClass.trim() || !selectedBook.id) {
      setNotification({ show: true, message: 'Harap lengkapi nama, kelas, dan pilih buku.' });
      return;
    }

    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 7); // Tenggat waktu 7 hari

    const nextId = `#PJ-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const newLoanData = {
      kodePinjam: nextId,
      namaPeminjam: studentName.trim(),
      kelas: studentClass.trim(), 
      bukuId: selectedBook.id,
      tenggatWaktu: due.toISOString(),
    };

    try {
      const res = await fetch('/api/peminjaman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLoanData),
      });

      if (res.ok) {
        const savedLoan = await res.json();
        setLoans((prev) => [savedLoan, ...prev]);
        
        // Update stok buku di state lokal
        setBooks(books.map(b => b.id === selectedBook.id ? { ...b, stok: b.stok - 1 } : b));

        setStudentName('');
        setStudentClass(''); 
        setSelectedBook({ id: null, title: '' });
        setBookQuery('');
        setPage(1);
        setNotification({ show: true, message: 'Peminjaman berhasil dicatat!' });
      } else {
        setNotification({ show: true, message: 'Gagal mencatat peminjaman.' });
      }
    } catch (error) {
      console.error(error);
      setNotification({ show: true, message: 'Terjadi kesalahan sistem.' });
    }
  }

  function handleReturnClick(loan) {
    setReturnConfirm({ show: true, loanData: loan });
  }

  async function executeReturn() {
    const loan = returnConfirm.loanData;
    try {
      const res = await fetch('/api/peminjaman', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loan.id, bukuId: loan.bukuId }),
      });

      if (res.ok) {
        const updatedLoan = await res.json();
        setLoans((prev) => prev.map((l) => (l.id === loan.id ? updatedLoan : l)));
        
        setBooks(books.map(b => b.id === loan.bukuId ? { ...b, stok: b.stok + 1 } : b));
        
        setNotification({ show: true, message: 'Buku berhasil dikembalikan!' });
      } else {
        setNotification({ show: true, message: 'Gagal memproses pengembalian.' });
      }
    } catch (error) {
      console.error(error);
      setNotification({ show: true, message: 'Terjadi kesalahan sistem.' });
    } finally {
      setReturnConfirm({ show: false, loanData: null });
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-4 md:px-10 py-6 md:py-8 pb-24 md:pb-8 max-w-6xl w-full">
        <Header searchValue={search} onSearchChange={setSearch} placeholder="Cari peminjam atau buku..." />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 relative">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-50" />
          </div>

          <h3 className="relative flex items-center gap-2 font-semibold text-gray-800 mb-5">
            <span className="text-brand text-xl leading-none">+</span> Catat Peminjaman Baru
          </h3>

          <form onSubmit={handleSubmit} className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_0.8fr_1.5fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Nama Peminjam</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Nama lengkap..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Kelas</label>
              <input
                required
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Contoh: 4A"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1.5">Cari & Pilih Buku</label>
              <div className="relative">
                <BookIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  value={selectedBook.title || bookQuery}
                  onChange={(e) => {
                    setBookQuery(e.target.value);
                    setSelectedBook({ id: null, title: '' });
                    setShowBookOptions(true);
                  }}
                  onFocus={() => setShowBookOptions(true)}
                  onBlur={() => setShowBookOptions(false)} // Disederhanakan
                  placeholder="Ketik judul / kode buku..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 cursor-pointer"
                />
              </div>
              
              {/* PENINGKATAN TAMPILAN DROPDOWN */}
              {showBookOptions && (
                <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                  {filteredBookOptions.length > 0 ? (
                    filteredBookOptions.map((b) => (
                      <li key={b.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            // Mencegah input kehilangan fokus sebelum klik diproses
                            e.preventDefault(); 
                            setSelectedBook({ id: b.id, title: b.judul });
                            setBookQuery('');
                            setShowBookOptions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-brand hover:text-white group flex flex-col transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="flex justify-between items-start w-full gap-2">
                            <span className="font-semibold truncate leading-tight">{b.judul}</span>
                            <span className="text-brand text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-md shrink-0 group-hover:bg-white group-hover:text-brand">
                              Stok: {b.stok}
                            </span>
                          </div>
                          <span className="text-gray-400 text-xs mt-1 group-hover:text-blue-100">
                            Kode: {b.kodeBuku || '-'}
                          </span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-4 text-sm text-gray-500 text-center">
                      Buku tidak ditemukan atau stok habis.
                    </li>
                  )}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    Memuat data dari database...
                  </td>
                </tr>
              ) : (
                paginated.map((loan) => (
                  <tr key={loan.id} className="border-b border-gray-50 last:border-0 align-top">
                    <td className="px-5 py-4 text-gray-400 font-medium">{loan.kodePinjam}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {loan.namaPeminjam} <span className="text-gray-400 font-normal ml-1">(Kelas {loan.kelas || '-'})</span>
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <BookIcon className="w-3 h-3" /> {loan.buku?.judul || 'Buku Dihapus'}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(loan.tanggalPinjam)}</td>
                    <td className={`px-5 py-4 font-medium ${loan.status === 'Terlambat' ? 'text-red-500' : 'text-gray-600'}`}>
                      {formatDate(loan.tenggatWaktu)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          statusStyles?.[loan.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {loan.status === 'Selesai' && '✓ '}
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {loan.status === 'Selesai' ? (
                        <span className="text-xs text-gray-400">
                          Dikembalikan ({formatDate(loan.tanggalKembali)})
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReturnClick(loan)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <UndoIcon className="w-3.5 h-3.5" />
                          Kembalikan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    Tidak ada data peminjaman.
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
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {returnConfirm.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Pengembalian</h3>
            <p className="text-sm text-gray-600 mb-6">
              Buku <b>"{returnConfirm.loanData?.buku?.judul}"</b> telah dikembalikan oleh peminjam?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setReturnConfirm({ show: false, loanData: null })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={executeReturn}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Ya, Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Informasi</h3>
            <p className="text-sm text-gray-500 mb-8">{notification.message}</p>
            <button
              onClick={() => setNotification({ show: false, message: '' })}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}