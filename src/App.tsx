import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import Admin from './pages/Admin';

// IMPORT LOGO DARI FOLDER ASSETS
import logoUm from './assets/logo-um.png'; 

// Komponen pembungkus untuk membaca rute URL saat ini
function AppContent() {
  const location = useLocation();

  // Cek apakah halaman saat ini adalah halaman admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* TAMPILKAN NAVBAR ATAS HANYA JIKA BUKAN HALAMAN ADMIN */}
      {!isAdminRoute && (
        <nav className="navbar" style={{ justifyContent: 'space-between' }}>
          
          {/* BAGIAN KIRI: Logo UM dan Tulisan Identitas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Memanggil logo dari import assets */}
            <img 
              src={logoUm} 
              alt="Logo Universitas Negeri Malang" 
              style={{ height: '38px', width: 'auto', objectFit: 'contain' }} 
            />
            <span style={{ 
              fontWeight: '700', 
              color: 'var(--text-heading)', 
              fontSize: '1.05rem', 
              letterSpacing: '0.3px',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              PPG Calon Guru 2026
            </span>
          </div>

          {/* BAGIAN KANAN: Menu Navigasi */}
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              Tentang Saya
            </Link>
            <Link to="/ppg-corner" className={`nav-link ${location.pathname.startsWith('/ppg-corner') ? 'active' : ''}`}>
              PPG Corner
            </Link>
          </div>

        </nav>
      )}

      {/* AREA KONTEN HALAMAN (ROUTING) */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ppg-corner" element={<Portfolio />} />
          <Route path="/ppg-corner/:id" element={<PortfolioDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>

    </div>
  );
}

// Komponen Utama App
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}