import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import type { MataKuliah } from '../types';

export default function Portfolio() {
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMataKuliah = async () => {
      // PENGURUTAN BERDASARKAN KOLOM 'urutan'
      const { data, error } = await supabase.from('mata_kuliah').select('*').order('urutan', { ascending: true });
      if (error) {
        console.error('Error fetching mata kuliah:', error.message);
      } else {
        setMataKuliahList((data as MataKuliah[]) || []);
      }
      setLoading(false);
    };

    fetchMataKuliah();
  }, []);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>Memuat data pembelajaran...</div>;
  }

  return (
    <div className="container" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* HEADER ELEGAN PPG CORNER */}
      <div style={{ background: 'var(--card-bg)', padding: '40px 40px', borderRadius: '24px', textAlign: 'center', marginBottom: '50px', border: '1px solid var(--card-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-color)', letterSpacing: '1.5px', textTransform: 'uppercase', background: 'var(--accent-glow)', padding: '6px 16px', borderRadius: '100px', display: 'inline-block', marginBottom: '20px' }}>Eksplorasi Pembelajaran</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '15px', color: 'var(--text-heading)' }}>PPG Corner</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
          Selamat datang di pusat dokumentasi perjalanan Pendidikan Profesi Guru saya. Jelajahi berbagai mata kuliah, temukan refleksi mendalam, dan lihat artefak pembelajaran yang telah saya kembangkan selama program ini.
        </p>
      </div>

      {/* DAFTAR MATA KULIAH (Kotak Fix & Kecil) */}
      {mataKuliahList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Belum ada mata kuliah yang ditambahkan.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {mataKuliahList.map((mk) => (
            <div key={mk.id} className="card" style={{ minHeight: '190px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-heading)', lineHeight: '1.4', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>
                {mk.nama_mata_kuliah}
              </h3>
              
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', paddingTop: '15px' }}>
                {mk.semester && (
                  <div style={{ display: 'inline-block', background: 'var(--accent-glow)', color: 'var(--accent-color)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    Semester {mk.semester}
                  </div>
                )}
                
                <Link to={`/ppg-corner/${mk.slug || mk.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                  <div style={{ padding: '10px', background: 'var(--accent-color)', color: '#FFFFFF', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', transition: 'opacity 0.2s' }}
                     onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                     onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Lihat Detail →
                </div>
              </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}