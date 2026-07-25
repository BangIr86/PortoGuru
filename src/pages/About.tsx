import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Profil } from '../types';
import fotoProfil from '../assets/foto-profil.jpg';

export default function About() {
  const [profil, setProfil] = useState<Profil | null>(null);

  useEffect(() => {
    const fetchProfil = async () => {
      const { data } = await supabase.from('profil').select('*').eq('id', 1).single();
      if (data) setProfil(data as Profil);
    };
    fetchProfil();
  }, []);

  if (!profil) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Memuat informasi...</p>;

  return (
    <div className="container">
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px' }}>Tentang Saya</h2>
      
      <div className="card" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Bagian Header Identitas dengan Foto Kecil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img 
            src={fotoProfil} 
            alt="Profil" 
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--border-color)' }} 
          />
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Identitas Diri</h3>
            <ul style={{ listStyleType: 'none', padding: 0, color: 'var(--text-muted)' }}>
              <li><strong>Nama Lengkap:</strong> {profil.nama_lengkap}</li>
              <li><strong>Tempat, Tanggal Lahir:</strong> {profil.tempat_tanggal_lahir}</li>
              <li><strong>Universitas:</strong> {profil.universitas}</li>
              <li><strong>Program Studi:</strong> {profil.program_studi}</li>
              <li><strong>Email:</strong> {profil.email}</li>
            </ul>
          </div>
        </div>

        <h3 style={{ marginTop: '20px' }}>Filosofi Mengajar</h3>
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          "{profil.filosofi_mengajar}"
        </p>

        <h3 style={{ marginTop: '20px' }}>Riwayat Pendidikan</h3>
        {/* Kita ubah teks dari database yang dipisahkan simbol | menjadi baris baru (list) */}
        <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
          {profil.riwayat_pendidikan.split('|').map((item, index) => (
            <li key={index}><strong>{item.trim()}</strong></li>
          ))}
        </ul>
      </div>
    </div>
  );
}