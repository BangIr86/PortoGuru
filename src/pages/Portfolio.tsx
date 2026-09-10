import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import type { MataKuliah } from '../types';

export default function Portfolio() {
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMataKuliah = async () => {
      // Menarik data berdasarkan kolom 'urutan', bukan 'id'
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
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Memuat data pembelajaran...</div>;
  }

  return (
    <div className="container">
      
      {/* HEADER ELEGAN PPG CORNER */}
      <div style={{ background: 'var(--card-bg)', padding: '40px 40px', borderRadius: '24px', textAlign: 'center', marginBottom: '50px', border: '1px solid var(--card-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-color)', letterSpacing: '1.5px', textTransform: 'uppercase', background: 'var(--accent-glow)', padding: '6px 16px', borderRadius: '100px', display: 'inline-block', marginBottom: '20px' }}>Eksplorasi Pembelajaran</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '15px' }}>PPG Corner</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
          Selamat datang di pusat dokumentasi perjalanan Pendidikan Profesi Guru saya. Jelajahi berbagai mata kuliah, temukan refleksi mendalam, dan lihat artefak pembelajaran yang telah saya kembangkan selama program ini.
        </p>
      </div>

      {mataKuliahList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Belum ada mata kuliah yang ditambahkan.
        </div>
      ) : (
        /* Menyesuaikan grid agar proporsional untuk kotak kecil */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {mataKuliahList.map((mk) => (
            <Link to={`/ppg-corner/${mk.id}`} key={mk.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              
              {/* Kotak dibuat fix height (140px) dan deskripsi dihilangkan */}
              <div className="card" style={{ height: '140px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
                
                {/* Judul Mata Kuliah dibatasi maksimal 2 baris agar tidak merusak layout jika teksnya terlalu panjang */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'auto', color: 'var(--text-heading)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {mk.nama_mata_kuliah}
                </h3>
                
                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-color)' }}>Buka Mata Kuliah</span>
                  <span style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>→</span>
                </div>
                
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}