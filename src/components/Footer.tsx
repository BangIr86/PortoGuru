import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      style={{
        background: 'var(--card-bg)',
        borderTop: '1px solid var(--card-border)',
        padding: '40px 20px 25px 20px',
        marginTop: 'auto',
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}
    >
      <div 
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}
      >
        {/* BAGIAN ATAS: GRID 3 KOLOM */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            paddingBottom: '25px',
            borderBottom: '1px solid var(--card-border)'
          }}
        >
          {/* Kolom 1: Identitas & Deskripsi Singkat */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-heading)' }}>
              PPG Calon Guru 2026
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Portofolio Digital Pendidik — Mengintegrasikan teknologi, inovasi pembelajaran, dan refleksi pedagogik untuk pendidikan masa depan.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-heading)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>
              Navigasi Cepat
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                  Tentang Saya
                </Link>
              </li>
              <li>
                <Link to="/ppg-corner" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                  PPG Corner
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Hubungi & Ikuti (KHUSUS LOGO SAJA & DIRECT LINK) */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-heading)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>
              Hubungi & Ikuti
            </h4>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              
              {/* Logo LinkedIn */}
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn"
                aria-label="LinkedIn"
                className="social-logo-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              {/* Logo YouTube */}
              <a 
                href="https://www.youtube.com/@PPGInformatikaUM2026" 
                target="_blank" 
                rel="noopener noreferrer"
                title="YouTube"
                aria-label="YouTube"
                className="social-logo-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Logo Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="social-logo-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* BAGIAN BAWAH: HAK CIPTA & AKSES ADMIN */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {currentYear} <strong>Khoirul Ibad.</strong> All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}