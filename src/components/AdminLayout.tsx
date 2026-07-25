import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Tambahkan logika logout jika ada (misal: hapus token/session)
    navigate('/login'); // atau arahkan ke beranda
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard / Ringkasan' },
    { path: '/admin/artefak', label: 'Kelola Artefak' },
    { path: '/admin/profil', label: 'Kelola Profil' },
    { path: '/admin/pesan', label: 'Pesan Masuk' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR KIRI PATEN / PERMANEN */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 shadow-lg">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-wide">Panel Admin</h2>
          <p className="text-xs text-slate-400 mt-1">Portofolio Calon Guru</p>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bagian Bawah Sidebar (Tombol Keluar / Kembali ke Website Utama) */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="block w-full text-center py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition"
          >
            Lihat Website Utama
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-center py-2 px-4 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-sm transition"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA DI SEBELAH KANAN (Tanpa Navbar Atas) */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};