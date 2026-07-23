import './globals.css';

export const metadata = {
  title: "Perpustakaan Digital - SDN Cijambe 1",
  description: "Sistem Kelola Perpustakaan SDN Cijambe 1",
  icons: {
    icon: '/logo.png', // Menarik logo dari folder public untuk tab browser
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased text-gray-800">{children}</body>
    </html>
  );
}
