import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PortfolioDetail() {
  const { id } = useParams(); // ID Mata Kuliah dari URL
  const [mataKuliah, setMataKuliah] = useState<any>(null);
  const [topikList, setTopikList] = useState<any[]>([]);
  const [artefakList, setArtefakList] = useState<any[]>([]);
  
  const [activeTopikId, setActiveTopikId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      // 1. Ambil data Mata Kuliah
      const { data: mkData, error: mkError } = await supabase
        .from('mata_kuliah')
        .select('*')
        .eq('id', id)
        .single();
      
      if (mkError) {
        console.error('Gagal memuat mata kuliah:', mkError.message);
      } else {
        setMataKuliah(mkData);
      }

      // 2. Ambil daftar Topik berdasarkan mata_kuliah_id
      const { data: tData } = await supabase
        .from('topik')
        .select('*')
        .eq('mata_kuliah_id', id)
        .order('id', { ascending: true });

      if (tData) {
        setTopikList(tData);
        // Otomatis pilih topik pertama jika ada
        if (tData.length > 0) {
          setActiveTopikId(tData[0].id);
        }
      }

      // 3. Ambil seluruh artefak yang berelasi dengan topik-topik di mata kuliah ini
      const { data: aData } = await supabase
        .from('artefak')
        .select('*, topik!inner(mata_kuliah_id)')
        .eq('topik.mata_kuliah_id', id);

      if (aData) {
        setArtefakList(aData);
      }

      setLoading(false);
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Memuat data pembelajaran...</div>;
  }

  if (!mataKuliah) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Mata kuliah tidak ditemukan.</div>;
  }

  // Saring artefak yang hanya milik topik yang sedang aktif diklik
  const activeArtefakList = artefakList.filter(a => a.topik_id === activeTopikId);

  // Fungsi pembantu untuk mengubah link YouTube biasa menjadi embed URL
  const getEmbedYouTubeUrl = (url: string) => {
    try {
      if (!url) return '';
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1]?.split('&')[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url;
    }
  };

  return (
    <div className="container">
      <Link to="/ppg-corner" style={{ 
        textDecoration: 'none', 
        color: 'var(--text-muted)', 
        fontWeight: '600', 
        display: 'inline-flex', 
        alignItems: 'center',
        gap: '8px',
        marginBottom: '30px',
        fontSize: '0.95rem',
        transition: 'color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        ← Kembali ke PPG Corner
      </Link>

      {/* Header Mata Kuliah */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', marginBottom: '15px' }}>{mataKuliah.nama_mata_kuliah}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '800px' }}>
          {mataKuliah.deskripsi_singkat}
        </p>
        
        {mataKuliah.refleksi && (
          <div style={{ 
            marginTop: '30px', 
            padding: '25px', 
            background: 'var(--card-bg)', 
            borderLeft: '4px solid var(--accent-color)', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>Refleksi Keseluruhan:</h4>
            <p style={{ margin: 0, fontStyle: 'italic', lineHeight: '1.7', color: 'var(--text-main)' }}>"{mataKuliah.refleksi}"</p>
          </div>
        )}
      </div>

      <h2 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '15px', marginBottom: '25px' }}>Topik Pembelajaran</h2>

      {topikList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada topik pembelajaran yang ditambahkan.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* GRID TOPIK: TEPAT 3 KOTAK DALAM 1 BARIS */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', /* Kunci untuk membagi tepat 3 kolom sejajar */
            gap: '15px' 
          }}>
            {topikList.map((topik) => {
              const isActive = topik.id === activeTopikId;
              return (
                <button
                  key={topik.id}
                  onClick={() => setActiveTopikId(topik.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '8px',
                    border: isActive ? '2px solid var(--accent-color)' : '1px solid var(--card-border)',
                    background: isActive ? 'var(--accent-color)' : 'var(--card-bg)',
                    color: isActive ? '#FFFFFF' : 'var(--text-main)',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    boxShadow: isActive ? '0 4px 12px var(--accent-glow)' : '0 2px 4px rgba(0,0,0,0.01)',
                    lineHeight: '1.5',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {topik.nama_topik}
                </button>
              );
            })}
          </div>

          {/* Detail Topik yang Sedang Dipilih & Artefaknya */}
          {activeTopikId && (() => {
            const currentTopik = topikList.find(t => t.id === activeTopikId);
            if (!currentTopik) return null;

            return (
              <div className="card" style={{ padding: '40px', borderTop: '4px solid var(--text-heading)' }}>
                <h3 style={{ fontSize: '1.6rem', marginTop: 0, marginBottom: '20px' }}>{currentTopik.nama_topik}</h3>
                
                {currentTopik.uraian_topik && (
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '1.05rem' }}>Uraian Topik:</h4>
                    <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>{currentTopik.uraian_topik}</p>
                  </div>
                )}

                {currentTopik.refleksi && (
                  <div style={{ marginBottom: '35px', padding: '20px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                    <h4 style={{ marginTop: '0', marginBottom: '10px', fontSize: '1.05rem' }}>Refleksi Topik:</h4>
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.7' }}>"{currentTopik.refleksi}"</p>
                  </div>
                )}

                <h4 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px', marginBottom: '25px' }}>
                  Artefak Pembelajaran
                </h4>
                
                {activeArtefakList.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada artefak yang diunggah untuk topik ini.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {activeArtefakList.map((artefak) => (
                      <div key={artefak.id} style={{ 
                        border: '1px solid var(--card-border)', 
                        borderRadius: '12px', 
                        padding: '25px', 
                        background: 'var(--card-bg)', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.02)' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                          <h5 style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.4' }}>
                            {artefak.judul}
                          </h5>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: '600', 
                            color: 'var(--accent-color)', 
                            background: 'var(--accent-glow)', 
                            padding: '6px 12px', 
                            borderRadius: '100px',
                            whiteSpace: 'nowrap'
                          }}>
                            {artefak.jenis}
                          </span>
                        </div>

                        {/* RENDER EMBED BERDASARKAN JENIS ARTEFAK */}
                        <div style={{ marginTop: '15px' }}>
                          {artefak.jenis === 'Dokumen / PDF' ? (
                            <div style={{ width: '100%', height: '600px', border: '1px solid var(--card-border)', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9' }}>
                              <iframe 
                                src={artefak.link_url} 
                                title={artefak.judul} 
                                width="100%" 
                                height="100%" 
                                style={{ border: 'none' }}
                              />
                            </div>
                          ) : artefak.jenis === 'Dokumentasi / Foto' ? (
                            <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '15px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                              <img 
                                src={artefak.link_url} 
                                alt={artefak.judul} 
                                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '4px' }} 
                              />
                            </div>
                          ) : artefak.jenis === 'Dokumentasi / Video' ? (
                            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                              <iframe 
                                src={getEmbedYouTubeUrl(artefak.link_url)} 
                                title={artefak.judul} 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen 
                              />
                            </div>
                          ) : (
                            <a href={artefak.link_url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-block' }}>
                              Buka Tautan Artefak →
                            </a>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })()}

        </div>
      )}
    </div>
  );
}