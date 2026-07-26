import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { Profil } from '../types';

// MENGIMPOR FOTO CADANGAN DARI FOLDER ASSETS
import fotoProfilLokal from '../assets/foto_profil.jpg';

export default function Home() {
  const [profil, setProfil] = useState<Profil | null>(null);
  
  // ==========================================
  // STATE & LOGIKA KHUSUS SLIDESHOW (3D STACK)
  // ==========================================
  const [images, setImages] = useState<string[]>([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const DURASI_BERGANTIAN = 5000; // 5 detik

  useEffect(() => {
    const fetchDataAndImages = async () => {
      // 1. Ambil Data Profil
      const { data: profilData } = await supabase.from('profil').select('*').eq('id', 1).single();
      if (profilData) {
        setProfil(profilData as Profil);
      }

      // 2. Ambil Daftar Semua Foto di Folder Storage
      const { data: filesData, error } = await supabase.storage.from('portfolio-files').list('slideshow_profil');

      if (!error && filesData && filesData.length > 0) {
        const publicUrls = filesData
          .filter(file => file.name !== '.emptyFolderPlaceholder') 
          .map(file => {
            const { data } = supabase.storage.from('portfolio-files').getPublicUrl(`slideshow_profil/${file.name}`);
            return data.publicUrl;
          });
        
        setImages(publicUrls);
      } else if (profilData && profilData.foto_profil) {
        setImages([profilData.foto_profil]);
      } else {
        setImages([fotoProfilLokal]);
      }
    };

    fetchDataAndImages();
  }, []);

  // 3. Logika Timer berjalan otomatis
  useEffect(() => {
    if (images.length <= 1) return; // Tidak perlu timer jika hanya ada 1 foto

    const interval = setInterval(() => {
      // Pindah ke foto selanjutnya setiap 5 detik
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, DURASI_BERGANTIAN);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!profil) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Memuat data...</div>;
  }

  return (
    <div className="hero-container">
      
      {/* BAGIAN KIRI: Teks Sapaan */}
      <div className="hero-content">
        <span className="hero-badge">Portofolio Pendidik</span>
        <h1 className="hero-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {profil.nama_lengkap}
        </h1>
        <h2 className="hero-subtitle" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {profil.gelar_status}
        </h2>
        <div className="hero-divider"></div>
        <p className="hero-description">
          {profil.deskripsi_home}
        </p>
        <div className="hero-actions">
          <Link to="/ppg-corner" className="btn-primary">Eksplorasi Artefak</Link>
          <Link to="/about" className="btn-outline">Profil Lengkap</Link>
        </div>
      </div>

      {/* ==========================================================
        BAGIAN KANAN: Foto Profil (Animasi 3D Stack / Tumpukan Kanan)
        ==========================================================
      */}
      <div className="hero-visual">
        <div 
          className="image-frame" 
          style={{ 
            position: 'relative', 
            // PENTING: overflow diubah menjadi 'visible' agar foto yang menumpuk di kanan tidak terpotong!
            overflow: 'visible', 
            width: '100%',
            aspectRatio: '3 / 4' 
          }}
        >
          
          {/* Garis biru / box belakang tetap dipertahankan di paling bawah */}
          <div className="image-backdrop" style={{ zIndex: 0 }}></div>

          {/* Loop dan tampilkan foto dengan logika posisi tumpukan */}
          {images.map((imgUrl, index) => {
            // Hitung jarak relatif foto ini dari foto yang sedang aktif
            const rel = (index - currentIndex + images.length) % images.length;

            let translateX = 0;
            let translateY = 0;
            let scale = 1;
            let zIndex = 0;
            let opacity = 0;

            // LOGIKA PENENTUAN POSISI (MAKSIMAL 3 TUMPUK)
            if (rel === 0) {
              // 1. FOTO UTAMA (Paling Depan)
              translateX = 0;
              translateY = 0;
              scale = 1;
              zIndex = 30;
              opacity = 1;
            } else if (rel === 1) {
              // 2. FOTO KEDUA (Membentuk tumpukan di kanan bawah, terlihat sedikit)
              translateX = 40; 
              translateY = 20; 
              scale = 0.95;
              zIndex = 20;
              opacity = 0.9;
            } else if (rel === 2 && images.length >= 3) {
              // 3. FOTO KETIGA (Mengintip lebih jauh di belakang)
              translateX = 80;
              translateY = 40;
              scale = 0.9;
              zIndex = 10;
              opacity = 0.6;
            } else if (rel === images.length - 1 && images.length > 2) {
              // 4. FOTO LAMA YANG LEWAT (Geser ke kiri dan memudar perlahan)
              translateX = -40;
              translateY = -20;
              scale = 1.05;
              zIndex = 40; // Ditaruh paling atas sesaat agar tidak "menembus" foto baru
              opacity = 0;
            } else {
              // Sisa foto disembunyikan di tumpukan paling belakang
              translateX = 80;
              translateY = 40;
              scale = 0.8;
              zIndex = 0;
              opacity = 0;
            }

            return (
              <img 
                key={imgUrl} 
                src={imgUrl} 
                alt={`${profil.nama_lengkap} - ${index + 1}`} 
                className="hero-image" 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  // Berikan bayangan yang berbeda antara foto depan dan belakang
                  boxShadow: rel === 0 ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 20px rgba(0,0,0,0.05)',
                  
                  // Kunci kehalusan animasi tumpukan:
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

    </div>
  );
}