import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '120px', paddingBottom: '120px' }}>
      <h1 style={{ 
        fontSize: '6rem', 
        color: 'var(--accent-color)', 
        marginBottom: '10px',
        lineHeight: '1'
      }}>
        404
      </h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-heading)' }}>
        Halaman Tidak Ditemukan
      </h2>
      <p style={{ 
        color: 'var(--text-muted)', 
        fontSize: '1.1rem', 
        marginBottom: '40px', 
        maxWidth: '500px', 
        margin: '0 auto 40px auto',
        lineHeight: '1.6'
      }}>
        Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau memang tidak pernah ada.
      </p>
      <Link to="/" className="btn-primary">
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}