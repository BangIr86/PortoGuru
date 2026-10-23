import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Inovasi } from '../types';

export default function Innovation() {
  const [inovasiList, setInovasiList] = useState<Inovasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInovasi, setSelectedInovasi] = useState<Inovasi | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchInovasi();
  }, []);

  // Tutup modal jika tombol ESC ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedInovasi(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchInovasi = async () => {
    setLoading(true);
    const { data } = await supabase.from('inovasi').select('*').order('urutan', { ascending: true });
    if (data) {
      setInovasiList(data);
    }
    setLoading(false);
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url) || url.includes('/portfolio-files/inovasi_dok/');
  };

  return (
    <div className="container" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* HEADER ELEGAN INNOVATION CORNER */}
      <div style={{ background: 'var(--card-bg)', padding: '40px 40px', borderRadius: '24px', textAlign: 'center', marginBottom: '50px', border: '1px solid var(--card-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-color)', letterSpacing: '1.5px', textTransform: 'uppercase', background: 'var(--accent-glow)', padding: '6px 16px', borderRadius: '100px', display: 'inline-block', marginBottom: '20px' }}>Karya & Pengembangan</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '15px', color: 'var(--text-heading)' }}>Innovation Corner</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
          Dokumentasi karya dan inovasi berbasis teknologi yang telah saya rancang, mencakup latar belakang masalah, tujuan, solusi terapan, dan dampak pembelajaran.
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
            const imageUrl = inovasi.gambar_url || `https://image.thum.io/get/width/600/crop/600/${inovasi.link_url}`;
            const hasDetails = Boolean(inovasi.problematika || inovasi.tujuan || inovasi.solusi || inovasi.dampak || inovasi.dokumentasi_url);
            
            return (
              <div key={inovasi.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
                {/* Thumbnail Gambar */}
                <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderBottom: '1px solid var(--card-border)', position: 'relative' }}>
                  <img 
                    src={imageUrl} 
                    alt={inovasi.judul} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {hasDetails && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', backdropFilter: 'blur(4px)', fontWeight: 600 }}>
                      Kajian Lengkap ✨
                    </span>
                  )}
                </div>

                {/* Konten Kartu */}
                <div style={{ padding: '22px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginTop: 0, color: 'var(--text-heading)', fontSize: '1.25rem', marginBottom: '10px', lineHeight: 1.4 }}>
                    {inovasi.judul}
                  </h3>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.6', flexGrow: 1, marginBottom: '20px' }}>
                    {inovasi.deskripsi}
                  </p>

                  {/* Tombol Aksi */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button 
                      onClick={() => setSelectedInovasi(inovasi)}
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        background: 'transparent', 
                        border: '1px solid var(--accent-color)', 
                        color: 'var(--accent-color)', 
                        borderRadius: '8px', 
                        fontWeight: 'bold', 
                        fontSize: '0.88rem', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-color)'; e.currentTarget.style.color = '#FFFFFF'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-color)'; }}
                    >
                      📖 Detail & Kajian
                    </button>

                    <a 
                      href={inovasi.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary" 
                      style={{ flex: 1, textAlign: 'center', padding: '10px', boxSizing: 'border-box', fontSize: '0.88rem' }}
                    >
                      Kunjungi ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL POPUP DETAIL & KAJIAN INOVASI */}
      {selectedInovasi && (
        <div 
          onClick={() => setSelectedInovasi(null)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0, 0, 0, 0.65)', 
            backdropFilter: 'blur(6px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999, 
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{ 
              background: 'var(--card-bg)', 
              borderRadius: '16px', 
              border: '1px solid var(--card-border)', 
              width: '100%', 
              maxWidth: '850px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative'
            }}
          >
            {/* Header Modal */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 10 }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>Kajian Lengkap Inovasi</span>
                <h2 style={{ margin: '4px 0 0 0', color: 'var(--text-heading)', fontSize: '1.5rem', lineHeight: 1.3 }}>{selectedInovasi.judul}</h2>
              </div>
              <button 
                onClick={() => setSelectedInovasi(null)} 
                aria-label="Tutup"
                style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1, padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            {/* Isi Modal */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* Ringkasan */}
              {selectedInovasi.deskripsi && (
                <div style={{ background: 'var(--bg-color)', padding: '16px 20px', borderRadius: '10px', borderLeft: '4px solid var(--accent-color)' }}>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.7', fontStyle: 'italic' }}>
                    "{selectedInovasi.deskripsi}"
                  </p>
                </div>
              )}

              {/* DOKUMENTASI INOVASI */}
              {selectedInovasi.dokumentasi_url && (
                <div style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', background: 'var(--bg-color)' }}>
                  <h4 style={{ margin: '0 0 14px 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
                    📸 Dokumentasi Inovasi
                  </h4>
                  {isImageFile(selectedInovasi.dokumentasi_url) ? (
                    <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', maxHeight: '400px', display: 'flex', justifyContent: 'center', background: '#000000' }}>
                      <img 
                        src={selectedInovasi.dokumentasi_url} 
                        alt="Dokumentasi Inovasi" 
                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Dokumentasi tersedia melalui tautan berikut:</p>
                      <a 
                        href={selectedInovasi.dokumentasi_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-primary" 
                        style={{ display: 'inline-block', fontSize: '0.88rem', padding: '8px 16px' }}
                      >
                        Buka Dokumentasi Inovasi ↗
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* 4 PILAR KAJIAN INOVASI */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                
                {/* 1. Problematika */}
                <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', border: '1px solid var(--card-border)', borderLeft: '4px solid #D97706' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#D97706', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📌 Problematika / Latar Belakang
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.93rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {selectedInovasi.problematika || 'Belum diisi.'}
                  </p>
                </div>

                {/* 2. Tujuan */}
                <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', border: '1px solid var(--card-border)', borderLeft: '4px solid var(--accent-color)' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--accent-color)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🎯 Tujuan Inovasi
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.93rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {selectedInovasi.tujuan || 'Belum diisi.'}
                  </p>
                </div>

                {/* 3. Solusi */}
                <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', border: '1px solid var(--card-border)', borderLeft: '4px solid #059669' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#059669', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💡 Solusi yang Diterapkan
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.93rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {selectedInovasi.solusi || 'Belum diisi.'}
                  </p>
                </div>

                {/* 4. Dampak */}
                <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', border: '1px solid var(--card-border)', borderLeft: '4px solid #7C3AED' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#7C3AED', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📈 Dampak & Hasil Nyata
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.93rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {selectedInovasi.dampak || 'Belum diisi.'}
                  </p>
                </div>

              </div>

            </div>

            {/* Footer Modal */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--card-bg)' }}>
              <button 
                onClick={() => setSelectedInovasi(null)} 
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Tutup
              </button>
              <a 
                href={selectedInovasi.link_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary" 
                style={{ padding: '10px 24px', textAlign: 'center', textDecoration: 'none' }}
              >
                Kunjungi Website Inovasi ↗
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

