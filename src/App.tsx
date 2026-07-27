import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound'; // <-- TAMBAHAN IMPORT NOT FOUND
import Footer from './components/Footer';

import logoUm from './assets/logo-um.png'; 

type Theme = 'light' | 'dark' | 'system';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // ==========================================
  // STATE & LOGIKA TEMA (DARK/LIGHT/SYSTEM)
  // ==========================================
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app-theme') as Theme) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('app-theme', theme);

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
           root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {!isAdminRoute && (
        <nav className="navbar" style={{ justifyContent: 'space-between' }}>
          
          {/* BAGIAN KIRI: Logo UM */}
          <Link 
            to="/" 
            className="nav-brand" 
            onClick={closeMobileMenu}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          >
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
          </Link>

          {/* BAGIAN KANAN: Menu Navigasi & Kontrol */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            {/* Navigasi Utama */}
            <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <Link to="/" onClick={closeMobileMenu} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/about" onClick={closeMobileMenu} className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>Tentang Saya</Link>
              <Link to="/ppg-corner" onClick={closeMobileMenu} className={`nav-link ${location.pathname.startsWith('/ppg-corner') ? 'active' : ''}`}>PPG Corner</Link>
              <Link to="/contact" onClick={closeMobileMenu} className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Kontak</Link>
            </div>

            {/* Tombol Pemilih Tema */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'var(--card-bg)',
                color: 'var(--text-main)',
                border: '1px solid var(--card-border)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}
            >
              <option value="light">☀️ Terang</option>
              <option value="dark">🌙 Gelap</option>
              <option value="system">💻 Sistem</option>
            </select>

            {/* Tombol Hamburger (Khusus HP) */}
            <button 
              className="hamburger-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

        </nav>
      )}

      {/* KONTEN UTAMA */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ppg-corner" element={<Portfolio />} />
          <Route path="/ppg-corner/:id" element={<PortfolioDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* <-- RUTE 404 (PENANGKAP URL SALAH) DITARUH PALING BAWAH --> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* FOOTER (Otomatis disembunyikan jika di halaman Admin) */}
      {!isAdminRoute && <Footer />}

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}