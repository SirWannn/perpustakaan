import './globals.css';

export const metadata = {
  title: 'Perpustakaan Digital - SDN Cijambe 1',
  description: 'Sistem manajemen perpustakaan digital untuk SDN Cijambe 1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased text-gray-800">{children}</body>
    </html>
  );
}
