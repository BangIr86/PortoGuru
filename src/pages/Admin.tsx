import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import type { Profil } from '../types';

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'profil' | 'manajemen'>('profil');
  const [managingMatkulId, setManagingMatkulId] = useState<number | null>(null);

  const [mataKuliahList, setMataKuliahList] = useState<any[]>([]);
  const [topikList, setTopikList] = useState<any[]>([]);
  const [artefakList, setArtefakList] = useState<any[]>([]);
  const [profil, setProfil] = useState<Profil | null>(null);

  // --- STATE KHUSUS FOTO SLIDESHOW ---
  const [slideshowFiles, setSlideshowFiles] = useState<any[]>([]);
  const [isUploadingSlideshow, setIsUploadingSlideshow] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const [editingMkId, setEditingMkId] = useState<number | null>(null);
  const [mkNama, setMkNama] = useState('');
  const [mkDeskripsi, setMkDeskripsi] = useState('');
  const [mkRefleksi, setMkRefleksi] = useState('');

  const [editingTopikId, setEditingTopikId] = useState<number | null>(null);
  const [tNama, setTNama] = useState('');
  const [tUraian, setTUraian] = useState('');
  const [tRefleksi, setTRefleksi] = useState('');

  const [editingArtefakId, setEditingArtefakId] = useState<number | null>(null);
  const [aTopikId, setATopikId] = useState('');
  const [aJudul, setAJudul] = useState('');
  const [aJenis, setAJenis] = useState('Dokumen / PDF');
  const [aLink, setALink] = useState('');
  const [aFile, setAFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'khoirulibad86') { setIsAuth(true); showToast('Berhasil masuk ke panel admin!', 'success'); } 
    else { showToast('Kata sandi salah!', 'error'); }
  };

  const fetchData = async () => {
    // Ambil Data Profil
    const { data: pData } = await supabase.from('profil').select('*').eq('id', 1).single();
    if (pData) setProfil(pData as Profil);

    // Ambil Data File Slideshow
    const { data: files } = await supabase.storage.from('portfolio-files').list('slideshow_profil');
    if (files) {
      setSlideshowFiles(files.filter(f => f.name !== '.emptyFolderPlaceholder'));
    }

    const { data: mkData } = await supabase.from('mata_kuliah').select('*').order('id', { ascending: true });
    if (mkData) setMataKuliahList(mkData);
    
    const { data: tData } = await supabase.from('topik').select('*').order('id', { ascending: true });
    if (tData) setTopikList(tData);

    const { data: aData } = await supabase.from('artefak').select('*, topik(id, nama_topik, mata_kuliah_id)');
    if (aData) setArtefakList(aData);
  };

  useEffect(() => { if (isAuth) fetchData(); }, [isAuth]);

  // --- FUNGSI MENGELOLA PROFIL ---
  const handleUpdateProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profil) return;
    const { error } = await supabase.from('profil').update({
      nama_lengkap: profil.nama_lengkap, gelar_status: profil.gelar_status, deskripsi_home: profil.deskripsi_home, tempat_tanggal_lahir: profil.tempat_tanggal_lahir, universitas: profil.universitas, program_studi: profil.program_studi, email: profil.email, filosofi_mengajar: profil.filosofi_mengajar, riwayat_pendidikan: profil.riwayat_pendidikan
    }).eq('id', 1);
    if (error) showToast('Gagal merubah biodata: ' + error.message, 'error'); else showToast('Biodata berhasil diperbarui!', 'success');
  };

  // --- FUNGSI MENGELOLA FOTO SLIDESHOW ---
  const handleUploadSlideshow = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `slideshow_profil/${Date.now()}.${fileExt}`;
    
    setIsUploadingSlideshow(true);
    const { error } = await supabase.storage.from('portfolio-files').upload(fileName, file);
    setIsUploadingSlideshow(false);

    if (error) {
      showToast('Gagal mengunggah foto: ' + error.message, 'error');
    } else {
      showToast('Foto berhasil diunggah!', 'success');
      fetchData(); // Segarkan daftar foto
    }
    e.target.value = ''; // Reset input file
  };

  const handleDeleteSlideshow = async (fileName: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini dari slideshow?')) {
      const { error } = await supabase.storage.from('portfolio-files').remove([`slideshow_profil/${fileName}`]);
      if (error) {
        showToast('Gagal menghapus foto: ' + error.message, 'error');
      } else {
        showToast('Foto berhasil dihapus!', 'success');
        fetchData();
      }
    }
  };

  // --- FUNGSI MENGELOLA MATA KULIAH ---
  const resetMatkulForm = () => { setEditingMkId(null); setMkNama(''); setMkDeskripsi(''); setMkRefleksi(''); };
  const handleSaveMK = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataMK = { nama_mata_kuliah: mkNama, deskripsi_singkat: mkDeskripsi, refleksi: mkRefleksi };
    if (editingMkId) {
      const { error } = await supabase.from('mata_kuliah').update(dataMK).eq('id', editingMkId);
      if (error) showToast('Gagal memperbarui: ' + error.message, 'error'); else { showToast('Mata Kuliah diperbarui!', 'success'); fetchData(); resetMatkulForm(); }
    } else {
      const { error } = await supabase.from('mata_kuliah').insert([dataMK]);
      if (error) showToast('Gagal menambah: ' + error.message, 'error'); else { showToast('Mata Kuliah ditambahkan!', 'success'); fetchData(); resetMatkulForm(); }
    }
  };

  const handleDeleteMK = async (id: number) => {
    if (window.confirm('Hapus Mata Kuliah ini? Semua topik dan artefak di dalamnya akan ikut terhapus!')) {
      const { error } = await supabase.from('mata_kuliah').delete().eq('id', id);
      if (error) showToast('Gagal menghapus: ' + error.message, 'error'); else { showToast('Mata Kuliah dihapus!', 'success'); fetchData(); }
    }
  };

  // --- FUNGSI MENGELOLA TOPIK ---
  const resetTopikForm = () => { setEditingTopikId(null); setTNama(''); setTUraian(''); setTRefleksi(''); };
  const handleSaveTopik = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!managingMatkulId) return;
    const dataTopik = { nama_topik: tNama, uraian_topik: tUraian, refleksi: tRefleksi, mata_kuliah_id: managingMatkulId };
    if (editingTopikId) {
      const { error } = await supabase.from('topik').update(dataTopik).eq('id', editingTopikId);
      if (error) showToast('Gagal memperbarui: ' + error.message, 'error'); else { showToast('Topik diperbarui!', 'success'); fetchData(); resetTopikForm(); }
    } else {
      const { error } = await supabase.from('topik').insert([dataTopik]);
      if (error) showToast('Gagal menambah: ' + error.message, 'error'); else { showToast('Topik ditambahkan!', 'success'); fetchData(); resetTopikForm(); }
    }
  };

  const handleDeleteTopik = async (id: number) => {
    if (window.confirm('Hapus Topik ini? Semua artefak di dalamnya akan ikut terhapus!')) {
      const { error } = await supabase.from('topik').delete().eq('id', id);
      if (error) showToast('Gagal menghapus: ' + error.message, 'error'); else { showToast('Topik dihapus!', 'success'); fetchData(); }
    }
  };

  // --- FUNGSI MENGELOLA ARTEFAK ---
  const resetArtefakForm = () => { setEditingArtefakId(null); setAJudul(''); setAJenis('Dokumen / PDF'); setALink(''); setAFile(null); setATopikId(''); };
  const handleSaveArtefak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTopikId) return showToast('Pilih Topik terlebih dahulu!', 'error');

    let finalUrl = aLink;
    setIsUploading(true);

    try {
      if ((aJenis === 'Dokumen / PDF' || aJenis === 'Dokumentasi / Foto') && aFile) {
        const fileExt = aFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('portfolio-files').upload(fileName, aFile);
        if (uploadError) throw uploadError;
        const { data: publicURLData } = supabase.storage.from('portfolio-files').getPublicUrl(fileName);
        finalUrl = publicURLData.publicUrl;
      }
      const updateData: any = { judul: aJudul, jenis: aJenis, topik_id: parseInt(aTopikId) };
      if (finalUrl) updateData.link_url = finalUrl;

      if (editingArtefakId !== null) {
        const { error } = await supabase.from('artefak').update(updateData).eq('id', editingArtefakId);
        if (error) throw error;
        showToast('Artefak Berhasil Diperbarui!', 'success');
      } else {
        updateData.link_url = finalUrl;
        const { error } = await supabase.from('artefak').insert([updateData]);
        if (error) throw error;
        showToast('Artefak Berhasil Ditambahkan!', 'success');
      }
      fetchData(); resetArtefakForm();
    } catch (err: any) { showToast('Gagal menyimpan artefak: ' + err.message, 'error'); } finally { setIsUploading(false); }
  };

  const handleDeleteArtefak = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artefak ini?')) {
      const { error } = await supabase.from('artefak').delete().eq('id', id);
      if (error) showToast('Gagal menghapus: ' + error.message, 'error'); else { showToast('Artefak dihapus!', 'success'); fetchData(); }
    }
  };

  const activeMatkulData = mataKuliahList.find(mk => mk.id === managingMatkulId);
  const activeTopikList = topikList.filter(t => t.mata_kuliah_id === managingMatkulId);
  const activeArtefakList = artefakList.filter(a => a.topik?.mata_kuliah_id === managingMatkulId);

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #CBD5E0', fontFamily: 'inherit', background: '#FFFFFF', color: '#2D3748' };

  if (!isAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#0F172A', position: 'relative', padding: '20px' }}>
        <style>{`@keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ background: '#1E293B', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', color: '#FFFFFF' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#38BDF8' }}>Login Admin</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#94A3B8' }}>Kata Sandi Admin</label>
            <input type="password" placeholder="Masukkan Password" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={{ ...inputStyle, background: '#0F172A', color: '#FFFFFF', border: '1px solid #334155' }} />
            <button type="submit" style={{ padding: '12px', background: '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Masuk Panel</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={{ color: '#94A3B8', fontSize: '0.85rem', textDecoration: 'none' }}>← Kembali ke Website Utama</Link>
          </div>
        </div>
        {toast && (
          <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: toast.type === 'success' ? '#10B981' : '#EF4444', color: '#FFFFFF', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 9999, fontWeight: 'bold', fontSize: '0.95rem', animation: 'slideUpFade 0.3s ease-out forwards' }}>
            <span style={{ fontSize: '1.2rem' }}>{toast.type === 'success' ? '✅' : '⚠️'}</span> {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-layout" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#F8FAFC', overflow: 'hidden', fontFamily: 'Plus Jakarta Sans, sans-serif', position: 'relative' }}>
      <style>{`@keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* SIDEBAR ADMIN */}
      <aside className="admin-sidebar" style={{ width: '260px', background: '#0F172A', color: '#FFFFFF', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '4px 0 10px rgba(0,0,0,0.05)', height: '100vh' }}>
        <div style={{ padding: '25px 20px', borderBottom: '1px solid #1E293B' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#38BDF8' }}>Panel Admin</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.80rem', color: '#94A3B8' }}>Portofolio Pendidik</p>
        </div>

        <nav style={{ flex: 1, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[ { id: 'profil', label: '✎ Kelola Profil & Foto' }, { id: 'manajemen', label: '📚 Manajemen Pembelajaran' } ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setManagingMatkulId(null); resetMatkulForm(); }} style={{ textAlign: 'left', width: '100%', padding: '12px 20px', background: isActive ? '#3B82F6' : 'transparent', color: isActive ? '#FFFFFF' : '#CBD5E1', border: 'none', borderLeft: isActive ? '4px solid #38BDF8' : '4px solid transparent', cursor: 'pointer', fontWeight: isActive ? 'bold' : 'normal', fontSize: '0.95rem', transition: 'background 0.2s' }}>
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#1E293B', color: '#CBD5E1', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', transition: 'background 0.2s' }}>🌐 Lihat Website Utama</Link>
          <button onClick={() => setIsAuth(false)} style={{ width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', transition: 'background 0.2s' }}>🚪 Keluar Sesi</button>
        </div>
      </aside>

      {/* KONTEN UTAMA KANAN */}
      <main className="admin-main" style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '30px 40px', boxSizing: 'border-box' }}>
        <div className="admin-content-box" style={{ width: '100%', background: '#FFFFFF', borderRadius: '12px', padding: '35px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', minHeight: 'calc(100vh - 60px)', boxSizing: 'border-box' }}>

          {activeTab === 'profil' && (
            <div>
              {/* BAGIAN 1: FORM BIODATA */}
              <h2 style={{ marginTop: 0, color: '#1E293B', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>Kelola Biodata (Profil)</h2>
              {profil ? (
                <form onSubmit={handleUpdateProfil} style={{ marginTop: '20px' }}>
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Nama Lengkap</label>
                  <input type="text" value={profil.nama_lengkap} onChange={e => setProfil({...profil, nama_lengkap: e.target.value})} style={inputStyle} required />
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Gelar / Status</label>
                  <input type="text" value={profil.gelar_status} onChange={e => setProfil({...profil, gelar_status: e.target.value})} style={inputStyle} required />
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Deskripsi Beranda</label>
                  <textarea value={profil.deskripsi_home} onChange={e => setProfil({...profil, deskripsi_home: e.target.value})} rows={3} style={inputStyle} required />
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Tempat, Tanggal Lahir</label>
                  <input type="text" value={profil.tempat_tanggal_lahir} onChange={e => setProfil({...profil, tempat_tanggal_lahir: e.target.value})} style={inputStyle} required />
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Universitas</label>
                  <input type="text" value={profil.universitas} onChange={e => setProfil({...profil, universitas: e.target.value})} style={inputStyle} required />
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Program Studi</label>
                  <input type="text" value={profil.program_studi} onChange={e => setProfil({...profil, program_studi: e.target.value})} style={inputStyle} required />
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Email Kontak</label>
                  <input type="email" value={profil.email} onChange={e => setProfil({...profil, email: e.target.value})} style={inputStyle} required />
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Filosofi Mengajar</label>
                  <textarea value={profil.filosofi_mengajar} onChange={e => setProfil({...profil, filosofi_mengajar: e.target.value})} rows={3} style={inputStyle} required />
                  <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Riwayat Pendidikan (Gunakan tanda | untuk memisah baris)</label>
                  <textarea value={profil.riwayat_pendidikan} onChange={e => setProfil({...profil, riwayat_pendidikan: e.target.value})} rows={3} style={inputStyle} required />
                  <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Perbarui Biodata</button>
                </form>
              ) : <p>Memuat profil...</p>}

              {/* BAGIAN 2: KELOLA FOTO SLIDESHOW */}
              <div style={{ marginTop: '50px' }}>
                <h2 style={{ marginTop: 0, color: '#1E293B', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>
                  Kelola Foto Slideshow Profil
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '15px' }}>
                  Unggah beberapa foto terbaik Anda di sini. Foto-foto ini akan otomatis diputar secara bergantian saat pengunjung mengarahkan kursor ke foto Anda di halaman Beranda.
                </p>

                <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E0', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>+ Unggah Foto Baru</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadSlideshow}
                    disabled={isUploadingSlideshow}
                    style={{ ...inputStyle, marginBottom: '0' }}
                  />
                  {isUploadingSlideshow && <p style={{ fontSize: '0.85rem', color: '#3B82F6', marginTop: '10px', marginBottom: '0' }}>Sedang mengunggah foto...</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                  {slideshowFiles.length === 0 ? (
                    <p style={{ color: '#94A3B8', fontStyle: 'italic', gridColumn: '1 / -1' }}>Belum ada foto yang diunggah ke slideshow.</p>
                  ) : (
                    slideshowFiles.map(file => {
                      const fileUrl = supabase.storage.from('portfolio-files').getPublicUrl(`slideshow_profil/${file.name}`).data.publicUrl;
                      return (
                        <div key={file.name} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', background: '#FFFFFF', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                          <img src={fileUrl} alt={file.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                          <button
                            onClick={() => handleDeleteSlideshow(file.name)}
                            style={{ width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', borderTop: '1px solid #E2E8F0', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'background 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#EF4444'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#EF4444'}
                          >
                            Hapus Foto
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manajemen' && (
            <div>
              {!managingMatkulId ? (
                <>
                  <h2 style={{ marginTop: 0, color: '#1E293B', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>Daftar Mata Kuliah</h2>
                  <form onSubmit={handleSaveMK} style={{ marginTop: '20px', background: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#3B82F6' }}>{editingMkId ? '✎ Edit Mata Kuliah' : '+ Tambah Mata Kuliah Baru'}</h4>
                    <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Nama Mata Kuliah</label>
                    <input type="text" placeholder="Contoh: Pembelajaran Terpadu" value={mkNama} onChange={e => setMkNama(e.target.value)} required style={inputStyle} />
                    <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Deskripsi Singkat</label>
                    <textarea placeholder="Deskripsi mengenai mata kuliah ini..." value={mkDeskripsi} onChange={e => setMkDeskripsi(e.target.value)} rows={2} required style={inputStyle} />
                    <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Refleksi Akhir Mata Kuliah</label>
                    <textarea placeholder="Refleksi keseluruhan..." value={mkRefleksi} onChange={e => setMkRefleksi(e.target.value)} rows={2} required style={inputStyle} />
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button type="submit" className="btn-primary">{editingMkId ? 'Simpan Perubahan' : 'Simpan Mata Kuliah'}</button>
                      {editingMkId && <button type="button" onClick={resetMatkulForm} style={{ padding: '10px 20px', background: '#64748B', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>}
                    </div>
                  </form>

                  <div style={{ overflowX: 'auto', marginTop: '30px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                      <thead>
                        <tr style={{ background: '#1E293B', color: '#FFFFFF' }}>
                          <th style={{ padding: '12px', border: '1px solid #CBD5E0' }}>Nama Mata Kuliah</th>
                          <th style={{ padding: '12px', border: '1px solid #CBD5E0', textAlign: 'center' }}>Aksi Kelola</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mataKuliahList.length === 0 ? (
                          <tr><td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Belum ada data mata kuliah.</td></tr>
                        ) : (
                          mataKuliahList.map((mk) => (
                            <tr key={mk.id} style={{ background: '#FFFFFF' }}>
                              <td style={{ padding: '12px', border: '1px solid #CBD5E0', fontWeight: 'bold', color: '#2D3748' }}>{mk.nama_mata_kuliah}</td>
                              <td style={{ padding: '12px', border: '1px solid #CBD5E0', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <button onClick={() => { setManagingMatkulId(mk.id); resetTopikForm(); resetArtefakForm(); }} style={{ padding: '8px 16px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold', marginBottom: '5px' }}>📂 Kelola Topik & Artefak</button>
                                <button onClick={() => { setEditingMkId(mk.id); setMkNama(mk.nama_mata_kuliah); setMkDeskripsi(mk.deskripsi_singkat); setMkRefleksi(mk.refleksi); }} style={{ padding: '8px 16px', background: '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', marginBottom: '5px' }}>Edit</button>
                                <button onClick={() => handleDeleteMK(mk.id)} style={{ padding: '8px 16px', background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '5px' }}>Hapus</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setManagingMatkulId(null)} style={{ background: 'transparent', border: 'none', color: '#64748B', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>← Kembali ke Daftar Mata Kuliah</button>
                  <h2 style={{ marginTop: 0, color: '#1E293B', borderBottom: '2px solid #3B82F6', paddingBottom: '12px', fontSize: '1.5rem' }}>Mengelola: <span style={{ color: '#3B82F6' }}>{activeMatkulData?.nama_mata_kuliah}</span></h2>

                  {/* BAGIAN 1: KELOLA TOPIK */}
                  <div style={{ marginTop: '30px', padding: '25px', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#F8FAFC' }}>
                    <h3 style={{ marginTop: 0, color: '#0F172A', marginBottom: '20px' }}>1. Manajemen Topik Pembelajaran</h3>
                    <form onSubmit={handleSaveTopik}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#3B82F6' }}>{editingTopikId ? '✎ Edit Topik' : '+ Tambah Topik Baru'}</h5>
                      <input type="text" placeholder="Nama Topik (Cth: Topik 1: Konsep Dasar)" value={tNama} onChange={e => setTNama(e.target.value)} required style={inputStyle} />
                      <textarea placeholder="Uraian Topik..." value={tUraian} onChange={e => setTUraian(e.target.value)} rows={2} required style={inputStyle} />
                      <textarea placeholder="Refleksi Khusus Topik ini..." value={tRefleksi} onChange={e => setTRefleksi(e.target.value)} rows={2} required style={inputStyle} />
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{editingTopikId ? 'Simpan Perubahan Topik' : 'Simpan Topik'}</button>
                        {editingTopikId && <button type="button" onClick={resetTopikForm} style={{ padding: '8px 16px', background: '#64748B', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>}
                      </div>
                    </form>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', fontSize: '0.85rem', background: '#FFFFFF' }}>
                        <thead>
                          <tr style={{ background: '#E2E8F0', color: '#1E293B' }}>
                            <th style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'left' }}>Nama Topik</th>
                            <th style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'center', width: '150px' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeTopikList.length === 0 ? (
                            <tr><td colSpan={2} style={{ padding: '10px', textAlign: 'center', color: '#64748B' }}>Belum ada topik di mata kuliah ini.</td></tr>
                          ) : (
                            activeTopikList.map(t => (
                              <tr key={t.id}>
                                <td style={{ padding: '10px', border: '1px solid #CBD5E0' }}>{t.nama_topik}</td>
                                <td style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                  <button onClick={() => { setEditingTopikId(t.id); setTNama(t.nama_topik); setTUraian(t.uraian_topik); setTRefleksi(t.refleksi); }} style={{ padding: '4px 8px', background: '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
                                  <button onClick={() => handleDeleteTopik(t.id)} style={{ padding: '4px 8px', background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* BAGIAN 2: KELOLA ARTEFAK */}
                  <div style={{ marginTop: '30px', padding: '25px', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#F8FAFC' }}>
                    <h3 style={{ marginTop: 0, color: '#0F172A', marginBottom: '20px' }}>2. Manajemen Artefak Pembelajaran</h3>
                    {activeTopikList.length === 0 ? (
                      <div style={{ background: '#FEF08A', color: '#854D0E', padding: '15px', borderRadius: '6px', fontWeight: 'bold' }}>⚠️ Anda harus membuat minimal 1 Topik terlebih dahulu sebelum bisa menambahkan Artefak!</div>
                    ) : (
                      <>
                        <form onSubmit={handleSaveArtefak}>
                          <h5 style={{ margin: '0 0 10px 0', color: '#3B82F6' }}>{editingArtefakId ? '✎ Edit Artefak' : '+ Tambah Artefak Baru'}</h5>
                          <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.85rem'}}>Pilih Topik Induk</label>
                          <select value={aTopikId} onChange={e => setATopikId(e.target.value)} required style={inputStyle}>
                            <option value="" disabled>-- Pilih Topik --</option>
                            {activeTopikList.map(t => <option key={t.id} value={t.id}>{t.nama_topik}</option>)}
                          </select>
                          <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.85rem'}}>Judul Artefak</label>
                          <input type="text" placeholder="Cth: Modul Ajar Siklus 1" value={aJudul} onChange={e => setAJudul(e.target.value)} required style={inputStyle} />
                          
                          <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.85rem'}}>Jenis Artefak & Upload</label>
                          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                            <select value={aJenis} onChange={e => { setAJenis(e.target.value); setAFile(null); setALink(''); }} required style={{ ...inputStyle, width: 'auto', flex: 1, marginBottom: 0 }}>
                              <option value="Dokumen / PDF">Dokumen / PDF</option>
                              <option value="Dokumentasi / Foto">Dokumentasi / Foto</option>
                              <option value="Dokumentasi / Video">Dokumentasi / Video</option>
                            </select>
                            <div style={{ flex: 2, minWidth: '200px' }}>
                              {aJenis === 'Dokumentasi / Video' ? (
                                <input type="url" placeholder="Masukkan Link URL YouTube..." value={aLink} onChange={e => setALink(e.target.value)} required style={{ ...inputStyle, marginBottom: 0 }} />
                              ) : (
                                <input type="file" accept={aJenis === 'Dokumen / PDF' ? ".pdf" : "image/*"} onChange={e => setAFile(e.target.files ? e.target.files[0] : null)} style={{ ...inputStyle, padding: '7px', background: '#FFFFFF', marginBottom: 0 }} />
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button type="submit" className="btn-primary" disabled={isUploading} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{isUploading ? 'Mengunggah...' : editingArtefakId ? 'Simpan Perubahan Artefak' : 'Simpan Artefak'}</button>
                            {editingArtefakId && <button type="button" onClick={resetArtefakForm} style={{ padding: '8px 16px', background: '#64748B', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>}
                          </div>
                        </form>
                        
                        <div style={{ overflowX: 'auto', width: '100%' }}>
                          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', fontSize: '0.85rem', background: '#FFFFFF' }}>
                            <thead>
                              <tr style={{ background: '#E2E8F0', color: '#1E293B' }}>
                                <th style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'left' }}>Judul Artefak</th>
                                <th style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'left' }}>Topik Induk</th>
                                <th style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'center', width: '150px' }}>Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeArtefakList.length === 0 ? (
                                <tr><td colSpan={3} style={{ padding: '10px', textAlign: 'center', color: '#64748B' }}>Belum ada artefak di mata kuliah ini.</td></tr>
                              ) : (
                                activeArtefakList.map(a => (
                                  <tr key={a.id}>
                                    <td style={{ padding: '10px', border: '1px solid #CBD5E0' }}>{a.judul} <span style={{ color: '#3B82F6', fontSize: '0.75rem', marginLeft: '5px' }}>({a.jenis})</span></td>
                                    <td style={{ padding: '10px', border: '1px solid #CBD5E0' }}>{a.topik?.nama_topik}</td>
                                    <td style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                      <button onClick={() => { setEditingArtefakId(a.id); setATopikId(a.topik_id.toString()); setAJudul(a.judul); setAJenis(a.jenis); setALink(a.link_url); }} style={{ padding: '4px 8px', background: '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
                                      <button onClick={() => handleDeleteArtefak(a.id)} style={{ padding: '4px 8px', background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: toast.type === 'success' ? '#10B981' : '#EF4444', color: '#FFFFFF', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 9999, fontWeight: 'bold', fontSize: '0.95rem', animation: 'slideUpFade 0.3s ease-out forwards' }}>
          <span style={{ fontSize: '1.2rem' }}>{toast.type === 'success' ? '✅' : '⚠️'}</span> {toast.message}
        </div>
      )}

    </div>
  );
}