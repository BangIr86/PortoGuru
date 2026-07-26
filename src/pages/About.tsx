import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Profil } from '../types';

// MENGIMPOR FOTO DARI FOLDER ASSETS SEBAGAI CADANGAN
import fotoProfilLokal from '../assets/foto_profil.jpg';

export default function About() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);

  // --- STATE KHUSUS SLIDESHOW (3D STACK) ---
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const DURASI_BERGANTIAN = 5000; // 5 detik

  useEffect(() => {
    const fetchProfilAndImages = async () => {
      setLoading(true);
      
      // 1. Ambil Data Profil (Teks)
      const { data, error } = await supabase.from('profil').select('*').eq('id', 1).single();
      if (!error && data) {
        setProfil(data as Profil);
      }

      // 2. Ambil Daftar Semua Foto di Folder Storage
      const { data: filesData, error: filesError } = await supabase.storage.from('portfolio-files').list('slideshow_profil');

      if (!filesError && filesData && filesData.length > 0) {
        const publicUrls = filesData
          .filter(file => file.name !== '.emptyFolderPlaceholder') 
          .map(file => {
            const { data: urlData } = supabase.storage.from('portfolio-files').getPublicUrl(`slideshow_profil/${file.name}`);
            return urlData.publicUrl;
          });
        
        setImages(publicUrls);
      } else if (data && data.foto_profil) {
        setImages([data.foto_profil]);
      } else {
        setImages([fotoProfilLokal]);
      }

      setLoading(false);
    };

    fetchProfilAndImages();
  }, []);

  // --- Logika Timer Berjalan Otomatis ---
  useEffect(() => {
    if (images.length <= 1) return; // Tidak perlu timer jika foto hanya 1

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, DURASI_BERGANTIAN);

    return () => clearInterval(interval);
  }, [images.length]);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Memuat profil...</div>;
  }

  if (!profil) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Gagal memuat data profil.</div>;
  }

  const listPendidikan = profil.riwayat_pendidikan ? profil.riwayat_pendidikan.split('|').map(item => item.trim()) : [];

  return (
    <div className="container">
      
      {/* CSS INTERNAL KHUSUS HALAMAN ABOUT */}
      <style>{`
        .about-split-container { display: flex; align-items: flex-start; gap: 50px; margin-top: 30px; }
        .about-visual { flex: 1; position: sticky; top: 90px; display: flex; justify-content: flex-start; }
        
        /* PEMBARUAN: aspect-ratio dan overflow visible agar tumpukan 3D tidak terpotong */
        .about-image-frame { position: relative; width: 100%; max-width: 380px; aspect-ratio: 3 / 4; overflow: visible; }
        
        .about-image-backdrop { position: absolute; top: 25px; left: 25px; width: 100%; height: 100%; border: 2px solid var(--accent-color); border-radius: 16px; z-index: 0; }
        .about-details { flex: 1.5; display: flex; flex-direction: column; gap: 40px; }
        .section-title { font-size: 1.8rem; color: var(--text-heading); border-bottom: 2px solid var(--card-border); padding-bottom: 15px; margin-bottom: 25px; }
        .bio-item { display: flex; gap: 15px; margin-bottom: 18px; font-size: 1.05rem; }
        .bio-label { font-weight: 600; color: var(--text-heading); min-width: 120px; }
        .bio-value { color: var(--text-main); }
        
        @media (max-width: 900px) {
          .about-split-container { flex-direction: column; align-items: center; gap: 40px; }
          .about-visual { position: relative; top: 0; width: 100%; justify-content: center; order: -1; }
          .about-image-frame { max-width: 280px; }
          .about-image-backdrop { top: 15px; left: 15px; }
          .about-details { width: 100%; gap: 30px; }
          .section-title { font-size: 1.5rem; text-align: center; }
          .bio-item { flex-direction: column; gap: 5px; text-align: center; }
          .bio-label { min-width: 100%; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '10px' }}>Tentang Saya</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--accent-color)', fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {profil.program_studi} | {profil.universitas}
        </p>
      </div>

      <div className="about-split-container">
        
        {/* BAGIAN FOTO PROFIL (Sekarang menggunakan Tumpukan 3D) */}
        <div className="about-visual">
          <div className="about-image-frame">
            <div className="about-image-backdrop"></div>
            
            {images.map((imgUrl, index) => {
              const rel = (index - currentIndex + images.length) % images.length;
              let translateX = 0; let translateY = 0; let scale = 1; let zIndex = 0; let opacity = 0;

              if (rel === 0) {
                translateX = 0; translateY = 0; scale = 1; zIndex = 30; opacity = 1;
              } else if (rel === 1) {
                translateX = 40; translateY = 20; scale = 0.95; zIndex = 20; opacity = 0.9;
              } else if (rel === 2 && images.length >= 3) {
                translateX = 80; translateY = 40; scale = 0.9; zIndex = 10; opacity = 0.6;
              } else if (rel === images.length - 1 && images.length > 2) {
                translateX = -40; translateY = -20; scale = 1.05; zIndex = 40; opacity = 0;
              } else {
                translateX = 80; translateY = 40; scale = 0.8; zIndex = 0; opacity = 0;
              }

              return (
                <img 
                  key={imgUrl} 
                  src={imgUrl} 
                  alt={`${profil.nama_lengkap} - ${index + 1}`} 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: rel === 0 ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', 
                    zIndex: zIndex, 
                    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    opacity: opacity
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* BAGIAN DETAIL BIODATA & FILOSOFI */}
        <div className="about-details">
          <section className="card">
            <h2 className="section-title">Profil & Kontak</h2>
            <div className="bio-item"><span className="bio-label">Nama Lengkap</span><span className="bio-value">{profil.nama_lengkap}</span></div>
            <div className="bio-item"><span className="bio-label">Gelar/Status</span><span className="bio-value">{profil.gelar_status}</span></div>
            <div className="bio-item"><span className="bio-label">TTL</span><span className="bio-value">{profil.tempat_tanggal_lahir}</span></div>
            <div className="bio-item"><span className="bio-label">Email</span><span className="bio-value">{profil.email}</span></div>
          </section>

          <section className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
            <h2 className="section-title">Filosofi Mengajar</h2>
            <p style={{ fontStyle: 'italic', color: 'var(--text-main)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              "{profil.filosofi_mengajar}"
            </p>
          </section>

          <section className="card">
            <h2 className="section-title">Riwayat Pendidikan</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {listPendidikan.map((edu, index) => {
                const lines = edu.split(/\r?\n/).filter(line => line.trim() !== '');

                return (
                  <li key={index} style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.8rem', lineHeight: '1' }}>🎓</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {lines[0] && <span style={{ fontWeight: '700', color: 'var(--text-heading)', fontSize: '1.05rem' }}>{lines[0]}</span>}
                      {lines[1] && <span style={{ fontWeight: '600', color: 'var(--accent-color)', fontSize: '1rem' }}>{lines[1]}</span>}
                      {lines[2] && <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{lines[2]}</span>}
                      {lines.slice(3).map((line, i) => (
                        <span key={i} style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{line}</span>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

    </div>
  );
}