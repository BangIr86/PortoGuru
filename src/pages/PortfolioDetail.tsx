import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [matkul, setMatkul] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk menyimpan artefak yang sedang dilihat
  const [selectedArtefak, setSelectedArtefak] = useState<any | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDetailData();
  }, [id]);

  const fetchDetailData = async () => {
    try {
      setLoading(true);
      const { data: mkData, error: mkError } = await supabase.from('mata_kuliah').select('*').eq('id', id).single();
      if (mkError) throw mkError;

      let artefakData: any[] = [];
      let combinedTopics: any[] = [];

      if (mkData.has_topik !== false) {
        const { data: topikData } = await supabase.from('topik').select('*').eq('mata_kuliah_id', id).order('id', { ascending: true });
        const topikIds = topikData?.map(t => t.id) || [];
        
        if (topikIds.length > 0) {
          const { data: aData } = await supabase.from('artefak').select('*').in('topik_id', topikIds);
          if (aData) artefakData = aData;
        }

        combinedTopics = topikData?.map(t => ({
          ...t,
          artefak: artefakData.filter(a => a.topik_id === t.id)
        })) || [];
        setMatkul({ ...mkData, topik: combinedTopics });
      } else {
        const { data: aData } = await supabase.from('artefak').select('*').eq('mata_kuliah_id', id);
        if (aData) artefakData = aData;
        setMatkul({ ...mkData, artefakLangsung: artefakData });
      }
      
      // Auto-pilih artefak pertama jika ada
      if (artefakData.length > 0) setSelectedArtefak(artefakData[0]);

    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRefleksi = (refleksiText: string) => {
    if (!refleksiText) return <p style={{ color: 'var(--text-muted)' }}>Belum ada refleksi.</p>;
    try {
      const parsed = JSON.parse(refleksiText);
      if (parsed && typeof parsed === 'object' && ('connection' in parsed)) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: 'var(--accent-color)', fontSize: '1.05rem' }}>🔗 Connection</h5>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{parsed.connection || '-'}</p>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#EAB308', fontSize: '1.05rem' }}>🧗 Challenge</h5>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{parsed.challenge || '-'}</p>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#10B981', fontSize: '1.05rem' }}>💡 Concept</h5>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{parsed.concept || '-'}</p>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#8B5CF6', fontSize: '1.05rem' }}>🚀 Change</h5>
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
    if (!item) return <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '100px' }}>Pilih artefak di sebelah kiri</div>;
    
    if (item.jenis.includes('Video')) {
      const videoId = item.link_url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?]*)/)?.[1];
      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : item.link_url;
      return <iframe src={embedUrl} width="100%" height="100%" style={{ border: 'none', borderRadius: '8px' }} allowFullScreen></iframe>;
    }
    if (item.jenis.includes('Foto') || item.jenis.includes('Gambar')) {
      return <img src={item.link_url} alt={item.judul} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />;
    }
    return <iframe src={`${item.link_url}#toolbar=0&view=FitH`} width="100%" height="100%" style={{ border: 'none', borderRadius: '8px', background: '#FFFFFF' }}></iframe>;
  };

  // Mengumpulkan semua artefak, baik dari topik maupun langsung dari mata kuliah
  const allArtefak = matkul?.has_topik !== false 
    ? (matkul?.topik?.flatMap((t: any) => t.artefak) || [])
    : (matkul?.artefakLangsung || []);

  if (loading) return <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}><h2>Memuat...</h2></div>;
  if (!matkul) return <div className="container" style={{ textAlign: 'center' }}><h2>Mata Kuliah Tidak Ditemukan</h2><Link to="/ppg-corner" className="btn-primary">Kembali</Link></div>;

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="container" style={{ maxWidth: '1100px', padding: 0 }}>
        
        <Link to="/ppg-corner" style={{ display: 'inline-block', marginBottom: '20px', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Kembali ke PPG Corner
        </Link>

        {/* HEADER & REFLEKSI MATA KULIAH */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '30px', marginBottom: '40px' }}>
          <h1 style={{ marginTop: 0, color: 'var(--text-heading)', fontSize: '2rem', marginBottom: '15px' }}>{matkul.nama_mata_kuliah}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>{matkul.deskripsi_singkat}</p>
          <h3 style={{ color: 'var(--text-heading)', borderBottom: '2px solid var(--card-border)', paddingBottom: '10px', marginBottom: '15px' }}>Refleksi Akhir (4C)</h3>
          {renderRefleksi(matkul.refleksi)}
        </div>

        {/* SPLIT SCREEN ARTEFAK (Sesuai Gambar Request) */}
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '20px' }}>Koleksi Artefak Pembelajaran</h2>
        
        {allArtefak.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada artefak di mata kuliah ini.</p>
        ) : (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            
            {/* KIRI: DAFTAR TOMBOL ARTEFAK (Disembunyikan jika artefak hanya 1) */}
            {allArtefak.length > 1 && (
              <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allArtefak.map((a: any) => {
                  const isActive = selectedArtefak?.id === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedArtefak(a)}
                      style={{
                        padding: '15px', textAlign: 'left', borderRadius: '8px', cursor: 'pointer',
                        background: isActive ? 'var(--accent-glow)' : 'var(--card-bg)',
                        border: `1px solid ${isActive ? 'var(--accent-color)' : 'var(--card-border)'}`,
                        color: isActive ? 'var(--accent-color)' : 'var(--text-main)',
                        fontWeight: isActive ? 'bold' : 'normal',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{a.jenis.includes('Video') ? '🎥' : a.jenis.includes('Foto') ? '📸' : '📄'}</span>
                      <span>{a.judul}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* KANAN: PREVIEW ARTEFAK */}
            <div style={{ flex: '3 1 500px', height: '600px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
              {selectedArtefak && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--card-border)' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>{selectedArtefak.judul}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedArtefak.jenis}</span>
                  </div>
                  <a href={selectedArtefak.link_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 15px', fontSize: '0.85rem' }}>
                    Buka di Tab Baru ↗
                  </a>
                </div>
              )}
              <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '8px', overflow: 'hidden' }}>
                {renderPreviewContent(selectedArtefak)}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}