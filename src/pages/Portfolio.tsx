import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [mataKuliahList, setMataKuliahList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMataKuliah = async () => {
      // Menarik data tabel induk mata kuliah dari Supabase
      const { data, error } = await supabase.from('mata_kuliah').select('*').order('id', { ascending: true });
      if (!error && data) {
        setMataKuliahList(data);
      }
      setLoading(false);
    };
    fetchMataKuliah();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER SECTION (Tinggi Kotak Diperkecil, Lebar Tetap) */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '50px', 
        padding: '35px 20px', /* DIPERKECIL: sebelumnya 60px 20px */
        background: '#FFFFFF', 
        borderRadius: '16px', 
        border: '1px solid var(--card-border)', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)' 
      }}>
        <span className="hero-badge" style={{ backgroundColor: 'rgba(43, 108, 176, 0.1)', color: 'var(--accent-color)' }}>
          Eksplorasi Pembelajaran
        </span>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 3.5vw, 3rem)', 
          color: 'var(--text-heading)', 
          marginTop: '15px', /* DIPERKECIL: sebelumnya 20px */
          marginBottom: '15px' /* DIPERKECIL: sebelumnya 20px */
        }}>
          PPG Corner
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.7' }}>
          Selamat datang di pusat dokumentasi perjalanan Pendidikan Profesi Guru saya. Jelajahi berbagai mata kuliah, temukan refleksi mendalam, dan lihat artefak pembelajaran yang telah saya kembangkan selama program ini.
        </p>
      </div>

      {/* GRID KARTU MATA KULIAH */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          <p>Memuat koleksi mata kuliah...</p>
        </div>
      ) : mataKuliahList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed var(--card-border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Belum ada data mata kuliah yang ditambahkan melalui panel Admin.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '35px' 
        }}>
          {mataKuliahList.map((mk) => (
            <div key={mk.id} className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              padding: '40px',
              borderTop: '4px solid var(--accent-color)' // Aksen garis di atas kartu
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '15px', lineHeight: '1.3' }}>
                  {mk.nama_mata_kuliah}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '30px' }}>
                  {mk.deskripsi_singkat}
                </p>
              </div>
              
              <Link 
                to={`/ppg-corner/${mk.id}`} 
                style={{ 
                  display: 'inline-block', 
                  marginTop: 'auto',
                  paddingTop: '20px', 
                  color: 'var(--text-main)', 
                  fontWeight: '600', 
                  textDecoration: 'none',
                  borderTop: '1px solid var(--card-border)',
                  transition: 'color 0.3s ease',
                  fontSize: '0.95rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              >
                Jelajahi Artefak & Topik →
              </Link>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}