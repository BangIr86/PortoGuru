import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Profil } from '../types';
import fotoProfil from '../assets/foto-profil.jpg';

export default function About() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfil = async () => {
      // Mengambil data biodata tunggal
      const { data, error } = await supabase.from('profil').select('*').eq('id', 1).single();
      if (!error && data) {
        setProfil(data as Profil);
      }
      setLoading(false);
    };
    fetchProfil();
  }, []);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Memuat profil...</div>;
  }

  if (!profil) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Gagal memuat data profil.</div>;
  }

  // Fungsi untuk mengubah riwayat pendidikan menjadi list
  const listPendidikan = profil.riwayat_pendidikan.split('|').map(item => item.trim());

  return (
    <div className="container">
      
      {/* ==========================================================
        CSS INTERNAL KHUSUS HALAMAN ABOUT (UNTUK MEDIA QUERY FOTO)
        ==========================================================
      */}
      <style>{`
        /* Kontainer Utama Split Screen */
        .about-split-container {
          display: flex;
          align-items: flex-start;
          gap: 50px;
          margin-top: 30px;
        }

        /* Bagian Visual (Kiri di Desktop) */
        .about-visual {
          flex: 1;
          position: sticky;
          top: 90px; /* Jarak dari navbar */
          display: flex;
          justify-content: flex-start;
        }

        /* Bingkai Foto Elegan */
        .about-image-frame {
          position: relative;
          width: 100%;
          max-width: 380px; /* Ukuran maksimal foto di Desktop */
        }

        .about-photo {
          width: 100%;
          aspect-ratio: 3 / 4; /* Portrait elegan */
          object-fit: cover;
          border-radius: 16px;
          position: relative;
          z-index: 2;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        /* Aksen dekorasi belakang foto */
        .about-image-backdrop {
          position: absolute;
          top: 25px;
          left: 25px;
          width: 100%;
          height: 100%;
          border: 2px solid var(--accent-color);
          border-radius: 16px;
          z-index: 1;
        }

        /* Bagian Teks (Kanan di Desktop) */
        .about-details {
          flex: 1.5;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* Sub-judul section */
        .section-title {
          font-size: 1.8rem;
          color: var(--text-heading);
          border-bottom: 2px solid var(--card-border);
          padding-bottom: 15px;
          margin-bottom: 25px;
        }

        /* Item Biodata */
        .bio-item {
          display: flex;
          gap: 15px;
          margin-bottom: 18px;
          font-size: 1.05rem;
        }
        .bio-label {
          font-weight: 600;
          color: var(--text-heading);
          min-width: 120px;
        }
        .bio-value {
          color: var(--text-main);
        }

        /* ==========================================================
           RESPONSIVITAS MOBILE (HP & TABLET)
           ========================================================== */
        @media (max-width: 900px) {
          
          /* Matikan split screen, tumpuk vertikal */
          .about-split-container {
            flex-direction: column;
            align-items: center; /* Konten di tengah */
            gap: 40px;
          }

          /* Matikan posisi sticky, taruh di paling atas */
          .about-visual {
            position: relative;
            top: 0;
            width: 100%;
            justify-content: center; /* Foto di tengah layar */
            order: -1; /* Paksa visual muncul PERTAMA di HP */
          }

          /* Kecilkan ukuran maksimal foto di HP agar tidak aneh */
          .about-image-frame {
            max-width: 280px; 
          }

          /* Sesuaikan aksen belakang di HP */
          .about-image-backdrop {
            top: 15px;
            left: 15px;
          }

          /* Bagian Teks di HP */
          .about-details {
            width: 100%;
            gap: 30px;
          }

          .section-title {
            font-size: 1.5rem;
            text-align: center; /* Judul di tengah di HP */
          }

          .bio-item {
            flex-direction: column; /* Label & Nilai bertumpuk di HP */
            gap: 5px;
            text-align: center; /* Teks di tengah di HP */
          }
          .bio-label {
            min-width: 100%;
          }
        }
      `}</style>

      {/* HEADER PAGE */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '10px' }}>Tentang Saya</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--accent-color)', fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {profil.program_studi} | {profil.universitas}
        </p>
      </div>

      {/* KONTEN SPLIT SCREEN */}
      <div className="about-split-container">
        
        {/* BAGIAN FOTO PROFIL */}
        <div className="about-visual">
          <div className="about-image-frame">
            {/* Memanggil foto dari URL yang tersimpan di Supabase */}
            <img 
              src={profil.foto-profil ? profil.foto-profil : fotoProfil} 
              alt={profil.nama_lengkap} 
              className="about-photo" 
            />
            <div className="about-image-backdrop"></div>
          </div>
        </div>

        {/* BAGIAN DETAIL BIODATA & FILOSOFI */}
        <div className="about-details">
          
          {/* Section 1: Profil Singkat */}
          <section className="card">
            <h2 className="section-title">Profil & Kontak</h2>
            <div className="bio-item">
              <span className="bio-label">Nama Lengkap</span>
              <span className="bio-value">{profil.nama_lengkap}</span>
            </div>
            <div className="bio-item">
              <span className="bio-label">Gelar/Status</span>
              <span className="bio-value">{profil.gelar_status}</span>
            </div>
            <div className="bio-item">
              <span className="bio-label">TTL</span>
              <span className="bio-value">{profil.tempat_tanggal_lahir}</span>
            </div>
            <div className="bio-item">
              <span className="bio-label">Email</span>
              <span className="bio-value">{profil.email}</span>
            </div>
          </section>

          {/* Section 2: Filosofi Mengajar */}
          <section className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
            <h2 className="section-title">Filosofi Mengajar</h2>
            <p style={{ fontStyle: 'italic', color: 'var(--text-main)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              "{profil.filosofi_mengajar}"
            </p>
          </section>

          {/* Section 3: Riwayat Pendidikan */}
          <section className="card">
            <h2 className="section-title">Riwayat Pendidikan</h2>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {listPendidikan.map((edu, index) => (
                <li key={index} style={{ 
                  background: '#F8FAFC', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--card-border)',
                  fontSize: '1rem',
                  color: 'var(--text-main)'
                }}>
                  🎓 {edu}
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>

    </div>
  );
}