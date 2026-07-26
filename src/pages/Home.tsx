import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { Profil } from '../types';

// MENGIMPOR FOTO DARI FOLDER ASSETS
import fotoProfilLokal from '../assets/foto_profil.jpg';

export default function Home() {
  const [profil, setProfil] = useState<Profil | null>(null);

  useEffect(() => {
    const fetchProfil = async () => {
      const { data } = await supabase.from('profil').select('*').eq('id', 1).single();
      if (data) {
        setProfil(data as Profil);
      }
    };
    fetchProfil();
  }, []);

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

      {/* BAGIAN KANAN: Foto Profil */}
      <div className="hero-visual">
        <div className="image-frame">
          {/* MENGGUNAKAN LOGIKA: Jika foto di database kosong, gunakan foto lokal dari assets */}
          <img 
            src={profil.foto_profil || fotoProfilLokal} 
            alt={profil.nama_lengkap} 
            className="hero-image" 
          />
          <div className="image-backdrop"></div>
        </div>
      </div>

    </div>
  );
}