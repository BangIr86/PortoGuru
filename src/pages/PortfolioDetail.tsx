import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [matkul, setMatkul] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedArtifacts, setExpandedArtifacts] = useState<Record<number, boolean>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDetailData();
  }, [id]);

  const fetchDetailData = async () => {
    try {
      setLoading(true);
      const { data: mkData, error: mkError } = await supabase
        .from('mata_kuliah')
        .select('*')
        .eq('id', id)
        .single();
        
      if (mkError) throw mkError;

      const { data: topikData } = await supabase
        .from('topik')
        .select('*')
        .eq('mata_kuliah_id', id)
        .order('id', { ascending: true });

      let artefakData: any[] = [];
      const topikIds = topikData?.map(t => t.id) || [];
      
      if (topikIds.length > 0) {
        const { data: aData } = await supabase
          .from('artefak')
          .select('*')
          .in('topik_id', topikIds);
        if (aData) artefakData = aData;
      }

      const combinedTopics = topikData?.map(t => ({
        ...t,
        artefak: artefakData.filter(a => a.topik_id === t.id)
      })) || [];

      setMatkul({ ...mkData, topik: combinedTopics });
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleArtifact = (artifactId: number) => {
    setExpandedArtifacts(prev => ({
      ...prev,
      [artifactId]: !prev[artifactId]
    }));
  };

  const renderRefleksi = (refleksiText: string) => {
    if (!refleksiText) return <p style={{ color: 'var(--text-muted)' }}>Belum ada refleksi yang ditulis.</p>;

    try {
      const parsed = JSON.parse(refleksiText);
      if (parsed && typeof parsed === 'object' && ('connection' in parsed || 'challenge' in parsed)) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>🔗 Connection</h5>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{parsed.connection || '-'}</p>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#EAB308', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>🧗 Challenge</h5>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{parsed.challenge || '-'}</p>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>💡 Concept</h5>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{parsed.concept || '-'}</p>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>🚀 Change</h5>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{parsed.change || '-'}</p>
            </div>
          </div>
        );
      }
    } catch (e) {
      return <p style={{ color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>{refleksiText}</p>;
    }
    return <p style={{ color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>{refleksiText}</p>;
  };

  const renderPreviewContent = (item: any) => {
    if (!item) return null;
    if (item.jenis.includes('Video')) {
      const videoId = item.link_url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?]*)/)?.[1];
      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : item.link_url;
      return <iframe src={embedUrl} width="100%" height="450px" style={{ border: 'none', borderRadius: '8px' }} allowFullScreen></iframe>;
    }
    if (item.jenis.includes('Foto') || item.jenis.includes('Gambar')) {
      return <img src={item.link_url} alt={item.judul} style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', borderRadius: '8px' }} />;
    }
    return <iframe src={`${item.link_url}#toolbar=0&view=FitH`} width="100%" height="600px" style={{ border: 'none', borderRadius: '8px', background: '#FFFFFF' }}></iframe>;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h2>Memuat detail mata kuliah...</h2>
      </div>
    );
  }

  if (!matkul) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-heading)' }}>Mata Kuliah Tidak Ditemukan</h2>
        <Link to="/ppg-corner" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Kembali ke PPG Corner</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <Link to="/ppg-corner" style={{ display: 'inline-block', marginBottom: '20px', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Kembali ke Daftar Mata Kuliah
        </Link>

        {/* HEADER MATA KULIAH */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '30px', marginBottom: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h1 style={{ marginTop: 0, color: 'var(--text-heading)', fontSize: '2rem', marginBottom: '15px' }}>
            {matkul.nama_mata_kuliah}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
            {matkul.deskripsi_singkat}
          </p>
          
          <h3 style={{ color: 'var(--text-heading)', borderBottom: '2px solid var(--card-border)', paddingBottom: '10px', marginBottom: '15px' }}>
            Refleksi Akhir (4C)
          </h3>
          {renderRefleksi(matkul.refleksi)}
        </div>

        {/* DAFTAR TOPIK & ARTEFAK */}
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '20px' }}>Jurnal Topik & Artefak</h2>
        
        {matkul.topik?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada topik yang ditambahkan pada mata kuliah ini.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {matkul.topik.map((t: any, index: number) => (
              <div key={t.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', overflow: 'hidden' }}>
                
                {/* Header Topik */}
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '20px 25px', borderBottom: '1px solid var(--card-border)' }}>
                  <h3 style={{ margin: 0, color: 'var(--accent-color)', fontSize: '1.3rem' }}>
                    {index + 1}. {t.nama_topik}
                  </h3>
                  <p style={{ margin: '10px 0 0 0', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {t.uraian_topik}
                  </p>
                  {t.refleksi && (
                    <p style={{ margin: '10px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      Catatan: {t.refleksi}
                    </p>
                  )}
                </div>

                {/* Body Topik (Hanya Artefak) */}
                <div style={{ padding: '25px' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🗂️ Artefak Pembelajaran
                  </h4>
                  
                  {t.artefak?.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Belum ada artefak yang dilampirkan.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {t.artefak.map((a: any) => {
                        const isExpanded = expandedArtifacts[a.id];
                        return (
                          <div key={a.id} style={{ border: '1px solid var(--card-border)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-color)' }}>
                            <div 
                              onClick={() => toggleArtifact(a.id)}
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', cursor: 'pointer', transition: 'background 0.2s ease-in-out' }}
                              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '1.8rem' }}>
                                  {a.jenis.includes('Video') ? '🎥' : a.jenis.includes('Foto') ? '📸' : '📄'}
                                </span>
                                <div>
                                  <div style={{ fontWeight: 'bold', color: 'var(--text-heading)', fontSize: '1.05rem', marginBottom: '4px' }}>
                                    {a.judul}
                                  </div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {isExpanded ? 'Tutup dokumen' : `Klik untuk melihat ${a.jenis.includes('Video') ? 'video' : 'dokumen'} langsung`}
                                  </div>
                                </div>
                              </div>
                              <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</div>
                            </div>

                            {isExpanded && (
                              <div style={{ borderTop: '1px solid var(--card-border)', padding: '15px', background: '#0F172A', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <a href={a.link_url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', background: 'var(--accent-color)', color: '#FFF', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    Buka di Tab Baru ↗
                                  </a>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                  {renderPreviewContent(a)}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}