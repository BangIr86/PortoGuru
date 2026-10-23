import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { Inovasi } from '../types';

export default function InnovationDetail() {
  const { id } = useParams();
  const [inovasi, setInovasi] = useState<Inovasi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchInovasiDetail();
  }, [id]);

  const fetchInovasiDetail = async () => {
    try {
      setLoading(true);
      if (!id) return;

      const { data, error } = await supabase
        .from('inovasi')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setInovasi(data);
    } catch (err) {
      console.error('Error fetching inovasi detail:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk mendeteksi link YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?]*)/);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // Helper untuk mendeteksi file gambar
  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url) || url.includes('/portfolio-files/inovasi_dok/');
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
        <h2>Memuat Detail Inovasi...</h2>
      </div>
    );
  }

  if (!inovasi) {
    return (
      <div className="container" style={{ minHeight: '80vh', textAlign: 'center', paddingTop: '100px' }}>
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '15px' }}>Inovasi Tidak Ditemukan</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Data inovasi yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link to="/innovation-corner" className="btn-primary" style={{ textDecoration: 'none' }}>
          ← Kembali ke Innovation Corner
        </Link>
      </div>
    );
  }

  const youtubeEmbedUrl = inovasi.dokumentasi_url ? getYouTubeEmbedUrl(inovasi.dokumentasi_url) : null;
  const isImage = inovasi.dokumentasi_url ? isImageFile(inovasi.dokumentasi_url) : false;
  const webImageUrl = inovasi.gambar_url || `https://image.thum.io/get/width/800/crop/600/${inovasi.link_url}`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '80px', paddingTop: '40px' }}>
      <div className="container" style={{ maxWidth: '1050px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Tombol Kembali */}
        <Link 
          to="/innovation-corner" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '30px', 
            color: 'var(--accent-color)', 
            textDecoration: 'none', 
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          ← Kembali ke Innovation Corner
        </Link>

        {/* HERO SECTION / INFORMASI UTAMA INOVASI */}
        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '24px', 
          padding: '40px', 
          marginBottom: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center' }}>
            
            {/* Bagian Kiri: Teks Informasi */}
            <div style={{ flex: '1 1 450px' }}>
              <span style={{ 
                fontSize: '0.8rem', 
                fontWeight: 'bold', 
                color: 'var(--accent-color)', 
                letterSpacing: '1.5px', 
                textTransform: 'uppercase', 
                background: 'var(--accent-glow)', 
                padding: '6px 16px', 
                borderRadius: '100px', 
                display: 'inline-block', 
                marginBottom: '15px' 
              }}>
                Karya & Inovasi Teknologi
              </span>
              <h1 style={{ 
                margin: '0 0 16px 0', 
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', 
                color: 'var(--text-heading)', 
                lineHeight: 1.25 
              }}>
                {inovasi.judul}
              </h1>
              <p style={{ 
                color: 'var(--text-main)', 
                fontSize: '1.05rem', 
                lineHeight: '1.8', 
                marginBottom: '30px' 
              }}>
                {inovasi.deskripsi}
              </p>
              
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <a 
                  href={inovasi.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ 
                    padding: '12px 28px', 
                    fontSize: '1rem', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    textDecoration: 'none' 
                  }}
                >
                  Kunjungi Website Inovasi ↗
                </a>
              </div>
            </div>

            {/* Bagian Kanan: Thumbnail Pratinjau Website */}
            <div style={{ flex: '1 1 320px', maxWidth: '400px' }}>
              <div style={{ 
                width: '100%', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid var(--card-border)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.08)'
              }}>
                <img 
                  src={webImageUrl} 
                  alt={inovasi.judul} 
                  style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} 
                />
              </div>
            </div>

          </div>
        </div>

        {/* SECTION DOKUMENTASI PENERAPAN (FOTO / VIDEO) */}
        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '24px', 
          padding: '35px 40px', 
          marginBottom: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
        }}>
          <div style={{ marginBottom: '25px', borderBottom: '1px solid var(--card-border)', paddingBottom: '15px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📸 Dokumentasi Penerapan Inovasi
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Bukti dokumentasi implementasi inovasi berbasis video penerapan maupun foto kegiatan pembelajaran.
            </p>
          </div>

          {inovasi.dokumentasi_url ? (
            <div>
              {/* Jika Link YouTube */}
              {youtubeEmbedUrl ? (
                <div style={{ 
                  position: 'relative', 
                  paddingBottom: '56.25%', 
                  height: 0, 
                  overflow: 'hidden', 
                  borderRadius: '16px', 
                  border: '1px solid var(--card-border)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)' 
                }}>
                  <iframe 
                    src={youtubeEmbedUrl} 
                    title="Video Penerapan Inovasi"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen 
                  />
                </div>
              ) : isImage ? (
                /* Jika Foto / Gambar */
                <div style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  background: 'var(--bg-color)', 
                  border: '1px solid var(--card-border)',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.06)' 
                }}>
                  <img 
                    src={inovasi.dokumentasi_url} 
                    alt="Dokumentasi Penerapan Inovasi" 
                    style={{ maxWidth: '100%', maxHeight: '550px', objectFit: 'contain', display: 'block' }} 
                  />
                  <div style={{ padding: '12px', width: '100%', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--card-border)' }}>
                    Foto Bukti Penerapan / Implementasi Inovasi
                  </div>
                </div>
              ) : (
                /* Jika Berupa Link Lain (Drive / Tautan Eksternal) */
                <div style={{ 
                  padding: '30px', 
                  borderRadius: '16px', 
                  background: 'var(--bg-color)', 
                  border: '1px solid var(--card-border)',
                  textAlign: 'center' 
                }}>
                  <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '15px' }}>
                    Dokumentasi penerapan tersedia melalui tautan berikut:
                  </p>
                  <a 
                    href={inovasi.dokumentasi_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary" 
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', textDecoration: 'none' }}
                  >
                    Buka File Dokumentasi Penerapan ↗
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              background: 'var(--bg-color)', 
              borderRadius: '16px', 
              border: '1px dashed var(--card-border)',
              color: 'var(--text-muted)'
            }}>
              <p style={{ margin: 0 }}>Belum ada foto atau video dokumentasi penerapan yang diunggah untuk inovasi ini.</p>
            </div>
          )}
        </div>

        {/* SECTION 4 PILAR KAJIAN INOVASI */}
        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '24px', 
          padding: '35px 40px', 
          marginBottom: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
        }}>
          <div style={{ marginBottom: '25px', borderBottom: '1px solid var(--card-border)', paddingBottom: '15px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text-heading)' }}>
              ✨ Kajian Komprehensif Inovasi
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Uraian terstruktur mengenai problematika, tujuan, solusi terapan, serta dampak inovasi bagi pembelajaran.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '25px' }}>
            
            {/* 1. Problematika */}
            <div style={{ 
              background: 'var(--bg-color)', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid var(--card-border)', 
              borderLeft: '5px solid #D97706' 
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#D97706', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📌 Problematika / Latar Belakang Masalah
              </h3>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {inovasi.problematika || 'Belum ada uraian problematika.'}
              </p>
            </div>

            {/* 2. Tujuan */}
            <div style={{ 
              background: 'var(--bg-color)', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid var(--card-border)', 
              borderLeft: '5px solid var(--accent-color)' 
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--accent-color)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎯 Tujuan Pengembangan Inovasi
              </h3>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {inovasi.tujuan || 'Belum ada uraian tujuan inovasi.'}
              </p>
            </div>

            {/* 3. Solusi */}
            <div style={{ 
              background: 'var(--bg-color)', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid var(--card-border)', 
              borderLeft: '5px solid #059669' 
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#059669', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💡 Solusi Terapan & Cara Kerja
              </h3>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {inovasi.solusi || 'Belum ada uraian solusi.'}
              </p>
            </div>

            {/* 4. Dampak */}
            <div style={{ 
              background: 'var(--bg-color)', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid var(--card-border)', 
              borderLeft: '5px solid #7C3AED' 
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#7C3AED', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📈 Dampak & Hasil Nyata
              </h3>
              <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {inovasi.dampak || 'Belum ada uraian dampak inovasi.'}
              </p>
            </div>

          </div>
        </div>

        {/* BOTTOM CTA CARD */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--bg-color) 100%)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '24px', 
          padding: '40px', 
          textAlign: 'center' 
        }}>
          <h2 style={{ margin: '0 0 10px 0', color: 'var(--text-heading)', fontSize: '1.6rem' }}>
            Ingin Mencoba Langsung Inovasi Ini?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 25px auto' }}>
            Akses langsung platform atau website yang telah dikembangkan untuk melihat fitur-fitur interaktifnya.
          </p>
          <a 
            href={inovasi.link_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary" 
            style={{ padding: '14px 32px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            Buka Website Inovasi Sekarang ↗
          </a>
        </div>

      </div>
    </div>
  );
}

