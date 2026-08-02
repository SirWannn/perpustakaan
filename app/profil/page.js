'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ShieldIcon } from '@/components/icons';

// Fungsi format tanggal untuk tabel riwayat
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short' 
  });
}

export default function ProfilPage() {
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [loginHistory, setLoginHistory] = useState([]);

  const profile = {
    nama: 'Operator',
    email: 'ohwannn7@gmail.com',
    telepon: '0813-2292-272',
    peran: 'Administrator Utama',
    instansi: 'SDN Cijambe 1',
  };

  // Ambil data riwayat login saat halaman dimuat
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/riwayat-login');
        const data = await res.json();
        setLoginHistory(data);
      } catch (error) {
        console.error('Gagal load riwayat:', error);
      } finally {
        setIsLoadingLogs(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-4 md:px-10 py-6 md:py-8 pb-24 md:pb-8 max-w-6xl w-full">
        {/* Menyembunyikan kolom pencarian khusus di halaman ini */}
                <Header hideSearch={true} />

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Profil Saya</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola informasi pribadi dan keamanan akun Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-700 text-white font-bold text-4xl flex items-center justify-center mx-auto mb-4 shadow-md">
                {profile.nama.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{profile.nama}</h3>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mt-1">
                <ShieldIcon className="w-4 h-4 text-brand" />
                {profile.peran}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-brand text-xs font-semibold rounded-full border border-blue-100">
                {profile.instansi}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Detail Akun</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Nama Lengkap</p>
                  <p className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3">{profile.nama}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Email</p>
                  <p className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">No. Telepon</p>
                  <p className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3">{profile.telepon}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Riwayat Login (Log Akses)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Pantau aktivitas login ke akun administrator Anda.</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-50 bg-gray-50/50">
                      <th className="font-medium px-6 py-3">Waktu & Tanggal</th>
                      <th className="font-medium px-6 py-3">Perangkat / Browser</th>
                      <th className="font-medium px-6 py-3">Alamat IP</th>
                      <th className="font-medium px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingLogs ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                          Memuat data riwayat...
                        </td>
                      </tr>
                    ) : loginHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                          Belum ada riwayat login yang tercatat.
                        </td>
                      </tr>
                    ) : (
                      loginHistory.map((log) => (
                        <tr key={log.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-4 text-gray-600 font-medium">
                            {formatDateTime(log.waktu)}
                          </td>
                          <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span className="truncate max-w-[150px] inline-block" title={log.perangkat}>{log.perangkat}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                            {log.ip}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                log.status === 'Berhasil' 
                                  ? 'bg-green-50 text-green-700' 
                                  : 'bg-red-50 text-red-600'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}