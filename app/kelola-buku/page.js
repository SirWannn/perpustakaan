'use client';

import { useMemo, useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  BookIcon,
} from '@/components/icons';

const PAGE_SIZE = 5;

// State disederhanakan: Kode, Judul, Pengarang (penulis), Tahun, Stok
const emptyForm = { 
  kodeBuku: '', 
  judul: '', 
  penulis: '', 
  tahunTerbit: '', 
  stok: '' 
};

export default function KelolaBukuPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/buku');
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Gagal load buku", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const judul = b.judul ? b.judul.toLowerCase() : '';
      const pengarang = b.penulis ? b.penulis.toLowerCase() : '';
      return judul.includes(search.toLowerCase()) || pengarang.includes(search.toLowerCase());
    });
  }, [books, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  async function handleAddBook(e) {
    e.preventDefault();
    if (!form.judul.trim() || !form.kodeBuku.trim()) return;

    try {
      const res = await fetch('/api/buku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newBook = await res.json();
        setBooks((prev) => [newBook, ...prev]);
        setForm(emptyForm);
        setShowModal(false);
        setPage(1);
      } else {
        alert("Gagal menyimpan buku");
      }
    } catch (error) {
      console.error("Error submit:", error);
    }
  }

  function handleDelete(id) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">
        <Header searchValue={search} onSearchChange={setSearch} />

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Buku</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola daftar koleksi buku perpustakaan Anda secara dinamis.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-medium py-3 rounded-xl mb-6 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Tambah Buku Baru
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="font-medium px-5 py-3">Kode</th>
                <th className="font-medium px-5 py-3">Judul Buku</th>
                <th className="font-medium px-5 py-3">Pengarang</th>
                <th className="font-medium px-5 py-3">Tahun</th>
                <th className="font-medium px-5 py-3">Stok</th>
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
                paginated.map((book) => (
                  <tr key={book.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-4 font-semibold text-gray-700">{book.kodeBuku}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-11 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                          <BookIcon className="w-4 h-4" />
                        </div>
                        <p className="font-medium text-gray-800">{book.judul}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{book.penulis}</td>
                    <td className="px-5 py-4 text-gray-600">{book.tahunTerbit}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {book.stok}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand hover:bg-gray-50">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    Belum ada buku di database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-3 text-sm text-gray-500 border-t border-gray-100">
            <span>
              Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} buku
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tambah Buku Baru</h3>
            <form onSubmit={handleAddBook} className="space-y-3">
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Kode Buku</label>
                <input
                  required
                  value={form.kodeBuku}
                  onChange={(e) => setForm({ ...form, kodeBuku: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  placeholder="Contoh: B001"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Judul Buku</label>
                <input
                  required
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  placeholder="Masukkan judul buku"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Pengarang</label>
                <input
                  required
                  value={form.penulis}
                  onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  placeholder="Nama pengarang"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tahun Terbit</label>
                  <input
                    type="number"
                    value={form.tahunTerbit}
                    onChange={(e) => setForm({ ...form, tahunTerbit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stok</label>
                  <input
                    type="number"
                    required
                    value={form.stok}
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2.5 rounded-lg mt-4 transition-colors"
              >
                Simpan ke Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}