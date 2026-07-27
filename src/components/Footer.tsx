import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      borderTop: '1px solid var(--card-border)', 
      background: 'var(--card-bg)', 
      padding: '40px 20px 20px',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        gap: '30px',
        marginBottom: '30px'
      }}>
        
        {/* Kolom 1: Identitas Utama */}
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 700, 
            color: 'var(--text-heading)', 
            marginBottom: '10px',
            fontFamily: 'Playfair Display, serif'
          }}>
            M. Khoirul Ibad, S.Pd.
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '400px' }}>
            Portofolio Digital — Mendokumentasikan perjalanan, karya, dan refleksi pedagogik sebagai Mahasiswa PPG Calon Guru Tahun {currentYear} di Universitas Negeri Malang.
          </p>
        </div>

        {/* Kolom 2: Tautan Cepat */}
        <div style={{ flex: '1 1 120px' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '15px' }}>Tautan Cepat</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>Dashboard</Link>
            </li>
            <li>
              <Link to="/about" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>Profil & CV</Link>
            </li>
            <li>
              <Link to="/ppg-corner" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>PPG Corner</Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Kontak (Hanya Formspree) */}
        <div style={{ flex: '1 1 120px' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '15px' }}>Kontak</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/contact" style={{ color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
                Formulir Pesan
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 4: Sosial Media */}
        <div style={{ flex: '1 1 120px' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '15px' }}>Sosial Media</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>LinkedIn</a>
            </li>
            <li>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>GitHub</a>
            </li>
            <li>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>Instagram</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bagian Bawah: Copyright */}
      <div style={{ 
        textAlign: 'center', 
        paddingTop: '20px', 
        borderTop: '1px dashed var(--card-border)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        &copy; {currentYear} Khoirul Ibad. All Rights Reserved.
      </div>
    </footer>
  );
}