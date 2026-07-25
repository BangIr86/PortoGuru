import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { Profil } from '../types';
import fotoProfil from '../assets/foto-profil.jpg'; 

export default function Home() {
  const [profil, setProfil] = useState<Profil | null>(null);

  useEffect(() => {
    const fetchProfil = async () => {
      const { data } = await supabase.from('profil').select('*').eq('id', 1).single();
      if (data) setProfil(data as Profil);
    };
    fetchProfil();
  }, []);

  if (!profil) return <div className="hero-container" style={{ textAlign: 'center', justifyContent: 'center' }}><p>Memuat portofolio...</p></div>;

  return (
    <div className="hero-container">
      {/* BAGIAN KIRI: Teks & Informasi */}
      <div className="hero-content">
        <div className="hero-badge">Portofolio Pendidik</div>
        <h1 className="hero-title">{profil.nama_lengkap}</h1>
        <h2 className="hero-subtitle">{profil.gelar_status}</h2>
        
        <div className="hero-divider"></div>
        
        <p className="hero-description">
          {profil.deskripsi_home}
        </p>
        
        <div className="hero-actions">
          <Link to="/artefak" className="btn-primary">
            Jelajahi Artefak ➔
          </Link>
          <Link to="/about" className="btn-outline">
            Profil Lengkap
          </Link>
        </div>
      </div>

      {/* BAGIAN KANAN: Visual / Foto */}
      <div className="hero-visual">
        <div className="image-frame">
          <img 
            src={fotoProfil} 
            alt="Foto Profil" 
            className="hero-image"
          />
          {/* Elemen dekorasi kotak di belakang foto */}
          <div className="image-backdrop"></div>
        </div>
      </div>
    </div>
  );
}