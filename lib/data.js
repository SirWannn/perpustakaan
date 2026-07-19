// Mock/demo data. Replace with real API calls or a database connection
// (e.g. Prisma, Supabase) when wiring this up to a backend.

export const initialBooks = [
  {
    code: 'B001',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    year: 2005,
    stock: 12,
    category: 'Fiksi',
  },
  {
    code: 'B002',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    year: 1980,
    stock: 5,
    category: 'Sejarah',
  },
  {
    code: 'B003',
    title: 'Ensiklopedia Sains Anak',
    author: 'DK Publishing',
    year: 2018,
    stock: 20,
    category: 'Sains',
  },
  {
    code: 'B004',
    title: 'Kumpulan Dongeng Nusantara',
    author: 'Tim Kurikulum',
    year: 2015,
    stock: 8,
    category: 'Fiksi',
  },
  {
    code: 'B005',
    title: 'Pahlawan Revolusi',
    author: 'M. Yamin',
    year: 1999,
    stock: 6,
    category: 'Sejarah',
  },
  {
    code: 'B006',
    title: 'Petualangan Tata Surya',
    author: 'Dian Kusuma',
    year: 2020,
    stock: 14,
    category: 'Sains',
  },
];

export const categoryStyles = {
  Fiksi: 'bg-blue-100 text-blue-700',
  Sejarah: 'bg-amber-100 text-amber-700',
  Sains: 'bg-emerald-100 text-emerald-700',
};

export const initialLoans = [
  {
    id: '#PJ-20231015-01',
    student: 'Budi Santoso',
    class: '5A',
    book: 'Ensiklopedia Antariksa',
    borrowedDate: '15 Okt 2023',
    dueDate: '22 Okt 2023',
    status: 'Terlambat',
    returnedDate: null,
  },
  {
    id: '#PJ-20231020-05',
    student: 'Siti Aminah',
    class: '3B',
    book: 'Kumpulan Dongeng Nusantara',
    borrowedDate: '20 Okt 2023',
    dueDate: '27 Okt 2023',
    status: 'Dipinjam',
    returnedDate: null,
  },
  {
    id: '#PJ-20231018-02',
    student: 'Ahmad Fajar',
    class: '6',
    book: 'Pahlawan Revolusi',
    borrowedDate: '18 Okt 2023',
    dueDate: '25 Okt 2023',
    status: 'Selesai',
    returnedDate: '24 Okt 2023',
  },
];

export const statusStyles = {
  Terlambat: 'bg-red-100 text-red-600',
  Dipinjam: 'bg-gray-200 text-gray-600',
  Selesai: 'bg-green-100 text-green-700',
};
