import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [matkul, setMatkul] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDetailData();
  }, [id]);

  const fetchDetailData = async () => {
    try {
      setLoading(true);
      // 1. Ambil data Mata Kuliah
      const { data: mkData, error: mkError } = await supabase
        .from('mata_kuliah')
        .select('*')
        .eq('id', id)
        .single();
        
      if (mkError) throw mkError;

      // 2. Ambil data Topik terkait
      const { data: topikData } = await supabase
        .from('topik')
        .select('*')
        .eq('mata_kuliah_id', id)
        .order('id', { ascending: true });

      // 3. Ambil data Artefak untuk topik-topik tersebut
      let artefakData: any[] = [];
      const topikIds = topikData?.map(t => t.id) || [];
      
      if (topikIds.length > 0) {
        const { data: aData } = await supabase
          .from('artefak')
          .select('*')
          .in('topik_id', topikIds);
        if (aData) artefakData = aData;
      }

      // Gabungkan data
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

  // MESIN PEMBACA 4C (JSON PARSER)
  const renderRefleksi = (refleksiText: string) => {
    if (!refleksiText) return <p style={{ color: 'var(--text-muted)' }}>Belum ada refleksi yang ditulis.</p>;

    try {
      // Coba ubah teks menjadi objek JSON
      const parsed = JSON.parse(refleksiText);
      
      // Jika berhasil dan memiliki properti 4C, tampilkan Grid 4C
      if (parsed && typeof parsed === 'object' && ('connection' in parsed || 'challenge' in parsed)) {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
            
            {/* 1. Connection */}
            <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                🔗 Connection
              </h5>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {parsed.connection || '-'}
              </p>
            </div>

            {/* 2. Challenge */}
            <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#EAB308', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                🧗 Challenge
              </h5>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {parsed.challenge || '-'}
              </p>
            </div>

            {/* 3. Concept */}
            <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                💡 Concept
              </h5>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {parsed.concept || '-'}
              </p>
            </div>

            {/* 4. Change */}
            <div style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                🚀 Change
              </h5>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {parsed.change || '-'}
              </p>
            </div>

          </div>
        );
      }
    } catch (e) {
      // JIKA BUKAN JSON (Data Lama / Teks Biasa), tampilkan sebagai paragraf standar
      return <p style={{ color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>{refleksiText}</p>;
    }

    return <p style={{ color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>{refleksiText}</p>;
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
    <div style={{ padding: '40px 20px', minHeight: '100vh', background: 'var(--bg-color)' }}>
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
            Refleksi Akhir Mata Kuliah
          </h3>
          {/* Render Refleksi (Otomatis mendeteksi 4C atau Teks Biasa) */}
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
                </div>

                {/* Body Topik (Refleksi & Artefak) */}
                <div style={{ padding: '25px' }}>
                  
                  <h4 style={{ margin: '0 0 15px 0', color: 'var(--text-heading)' }}>Refleksi Pembelajaran (4C)</h4>
                  {renderRefleksi(t.refleksi)}

                  <h4 style={{ margin: '30px 0 15px 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🗂️ Artefak Pembelajaran
                  </h4>
                  
                  {t.artefak?.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Belum ada artefak yang dilampirkan.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                      {t.artefak.map((a: any) => (
                        <a 
                          key={a.id} 
                          href={a.link_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            padding: '15px', 
                            background: 'var(--bg-color)', 
                            border: '1px solid var(--card-border)', 
                            borderRadius: '8px',
                            textDecoration: 'none',
                            transition: 'transform 0.2s, border-color 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                        >
                          <span style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
                            {a.jenis.includes('Video') ? '🎥' : a.jenis.includes('Foto') ? '📸' : '📄'}
                          </span>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-heading)', fontSize: '0.95rem', marginBottom: '5px' }}>
                            {a.judul}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Klik untuk melihat {a.jenis.includes('Video') ? 'video' : 'dokumen'}
                          </span>
                        </a>
                      ))}
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