import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Inovasi } from '../types';

export default function Innovation() {
  const [inovasiList, setInovasiList] = useState<Inovasi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchInovasi();
  }, []);

  const fetchInovasi = async () => {
    setLoading(true);
    const { data } = await supabase.from('inovasi').select('*').order('urutan', { ascending: true });
    if (data) {
      setInovasiList(data);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* HEADER ELEGAN INNOVATION CORNER */}
      <div style={{ background: 'var(--card-bg)', padding: '40px 40px', borderRadius: '24px', textAlign: 'center', marginBottom: '50px', border: '1px solid var(--card-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-color)', letterSpacing: '1.5px', textTransform: 'uppercase', background: 'var(--accent-glow)', padding: '6px 16px', borderRadius: '100px', display: 'inline-block', marginBottom: '20px' }}>Karya & Pengembangan</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '15px', color: 'var(--text-heading)' }}>Innovation Corner</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
          Kumpulan inovasi dan karya website yang telah saya kembangkan.
        </p>
      </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}><h2>Memuat Inovasi...</h2></div>
        ) : inovasiList.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <h2>Belum ada inovasi yang ditambahkan.</h2>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '35px', maxWidth: '1100px', margin: '0 auto' }}>
            {inovasiList.map((inovasi) => {
              // Jika gambar_url kosong, gunakan thum.io untuk generate screenshot otomatis
              const imageUrl = inovasi.gambar_url || `https://image.thum.io/get/width/600/crop/600/${inovasi.link_url}`;
              
              return (
                <div key={inovasi.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderBottom: '1px solid var(--card-border)' }}>
                    <img 
                      src={imageUrl} 
                      alt={inovasi.judul} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-heading)', fontSize: '1.25rem', marginBottom: '10px' }}>{inovasi.judul}</h3>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5', flexGrow: 1, marginBottom: '20px' }}>
                      {inovasi.deskripsi}
                    </p>
                    <a 
                      href={inovasi.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary" 
                      style={{ textAlign: 'center', display: 'block', width: '100%', boxSizing: 'border-box' }}
                    >
                      Kunjungi Website ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}

