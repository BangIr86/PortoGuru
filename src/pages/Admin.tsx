import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import type { Profil } from '../types';

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [passcode, setPasscode] = useState('');

  // State untuk Tab Navigasi Admin di Sidebar
  const [activeTab, setActiveTab] = useState<'profil' | 'matkul' | 'topik' | 'artefak'>('profil');

  // State Data Master & List
  const [mataKuliahList, setMataKuliahList] = useState<any[]>([]);
  const [topikList, setTopikList] = useState<any[]>([]);
  const [artefakList, setArtefakList] = useState<any[]>([]);

  // State Form Profil (Biodata)
  const [profil, setProfil] = useState<Profil | null>(null);

  // State Form Mata Kuliah
  const [mkNama, setMkNama] = useState('');
  const [mkDeskripsi, setMkDeskripsi] = useState('');
  const [mkRefleksi, setMkRefleksi] = useState('');

  // State Form Topik
  const [tMkId, setTMkId] = useState('');
  const [tNama, setTNama] = useState('');
  const [tUraian, setTUraian] = useState('');
  const [tRefleksi, setTRefleksi] = useState('');

  // State Form Artefak (Tambah & Edit)
  const [editingArtefakId, setEditingArtefakId] = useState<number | null>(null);
  const [selectedMatkulId, setSelectedMatkulId] = useState(''); 
  const [aTopikId, setATopikId] = useState('');
  const [aJudul, setAJudul] = useState('');
  const [aJenis, setAJenis] = useState('Dokumen / PDF');
  const [aLink, setALink] = useState('');
  const [aFile, setAFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- STATE UNTUK NOTIFIKASI TOAST ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fungsi pemanggil notifikasi otomatis hilang
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000); // Notifikasi hilang otomatis setelah 3 detik
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'khoirulibad86') {
      setIsAuth(true); 
      showToast('Berhasil masuk ke panel admin!', 'success');
    } else {
      showToast('Kata sandi salah!', 'error');
    }
  };

  const fetchData = async () => {
    const { data: pData } = await supabase.from('profil').select('*').eq('id', 1).single();
    if (pData) setProfil(pData as Profil);

    const { data: mkData } = await supabase.from('mata_kuliah').select('*');
    if (mkData) setMataKuliahList(mkData);
    
    const { data: tData } = await supabase.from('topik').select('*');
    if (tData) setTopikList(tData);

    const { data: aData } = await supabase.from('artefak').select('*, topik(id, nama_topik, mata_kuliah_id)');
    if (aData) setArtefakList(aData);
  };

  useEffect(() => {
    if (isAuth) fetchData();
  }, [isAuth]);

  // Eksekusi Update Profil
  const handleUpdateProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profil) return;
    
    const { error } = await supabase.from('profil').update({
      nama_lengkap: profil.nama_lengkap,
      gelar_status: profil.gelar_status,
      deskripsi_home: profil.deskripsi_home,
      tempat_tanggal_lahir: profil.tempat_tanggal_lahir,
      universitas: profil.universitas,
      program_studi: profil.program_studi,
      email: profil.email,
      filosofi_mengajar: profil.filosofi_mengajar,
      riwayat_pendidikan: profil.riwayat_pendidikan
    }).eq('id', 1);

    if (error) showToast('Gagal merubah biodata: ' + error.message, 'error');
    else showToast('Biodata berhasil diperbarui!', 'success');
  };

  // Eksekusi Tambah Mata Kuliah
  const handleAddMK = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('mata_kuliah').insert([{ nama_mata_kuliah: mkNama, deskripsi_singkat: mkDeskripsi, refleksi: mkRefleksi }]);
    if (error) showToast('Gagal menambahkan matkul: ' + error.message, 'error');
    else { showToast('Mata Kuliah Berhasil Ditambahkan!', 'success'); fetchData(); setMkNama(''); setMkDeskripsi(''); setMkRefleksi(''); }
  };

  // Eksekusi Tambah Topik
  const handleAddTopik = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!tMkId) return showToast('Pilih Mata Kuliah terlebih dahulu!', 'error');
    const { error } = await supabase.from('topik').insert([{ nama_topik: tNama, uraian_topik: tUraian, refleksi: tRefleksi, mata_kuliah_id: parseInt(tMkId) }]);
    if (error) showToast('Gagal menambahkan topik: ' + error.message, 'error');
    else { showToast('Topik Berhasil Ditambahkan!', 'success'); fetchData(); setTNama(''); setTUraian(''); setTRefleksi(''); setTMkId(''); }
  };

  // Eksekusi Simpan/Edit Artefak
  const handleSaveArtefak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatkulId) return showToast('Pilih Mata Kuliah terlebih dahulu!', 'error');
    if (!aTopikId) return showToast('Pilih Topik terlebih dahulu!', 'error');

    let finalUrl = aLink;
    setIsUploading(true);

    try {
      if ((aJenis === 'Dokumen / PDF' || aJenis === 'Dokumentasi / Foto') && aFile) {
        const fileExt = aFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-files')
          .upload(filePath, aFile);

        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from('portfolio-files')
          .getPublicUrl(filePath);

        finalUrl = publicURLData.publicUrl;
      }

      if (editingArtefakId !== null) {
        const updateData: any = {
          judul: aJudul,
          jenis: aJenis,
          topik_id: parseInt(aTopikId)
        };
        if (finalUrl) {
          updateData.link_url = finalUrl;
        }

        const { error } = await supabase.from('artefak').update(updateData).eq('id', editingArtefakId);
        if (error) throw error;
        showToast('Artefak Berhasil Diperbarui!', 'success');
      } else {
        const { error } = await supabase.from('artefak').insert([{
          judul: aJudul,
          jenis: aJenis,
          link_url: finalUrl,
          topik_id: parseInt(aTopikId)
        }]);
        if (error) throw error;
        showToast('Artefak Berhasil Ditambahkan!', 'success');
      }

      setEditingArtefakId(null);
      setAJudul('');
      setALink('');
      setAFile(null);
      setSelectedMatkulId('');
      setATopikId('');
      fetchData();
    } catch (err: any) {
      showToast('Gagal menyimpan artefak: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (artefak: any) => {
    setEditingArtefakId(artefak.id);
    setAJudul(artefak.judul);
    setAJenis(artefak.jenis);
    setALink(artefak.link_url);
    
    const topikData = topikList.find(t => t.id === artefak.topik_id);
    if (topikData) {
      setSelectedMatkulId(topikData.mata_kuliah_id.toString());
      setATopikId(topikData.id.toString());
    }
  };

  const handleDeleteArtefak = async (id: number) => {
    // Kita tetap memakai confirm khusus untuk penghapusan demi keamanan sebelum dieksekusi
    if (window.confirm('Apakah Anda yakin ingin menghapus artefak ini?')) {
      const { error } = await supabase.from('artefak').delete().eq('id', id);
      if (error) {
        showToast('Gagal menghapus: ' + error.message, 'error');
      } else {
        showToast('Artefak berhasil dihapus!', 'success');
        fetchData();
      }
    }
  };

  const filteredTopikList = topikList.filter(t => t.mata_kuliah_id === parseInt(selectedMatkulId));
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #CBD5E0', fontFamily: 'inherit', background: '#FFFFFF', color: '#2D3748' };

  // TAMPILAN HALAMAN LOGIN ADMIN
  if (!isAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#0F172A', position: 'relative' }}>
        
        {/* CSS Tambahan untuk Animasi Toast */}
        <style>
          {`
            @keyframes slideUpFade {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>

        <div style={{ background: '#1E293B', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', color: '#FFFFFF' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#38BDF8' }}>Login Admin</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#94A3B8' }}>Kata Sandi Admin</label>
            <input type="password" placeholder="Masukkan kata sandi admin" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={{ ...inputStyle, background: '#0F172A', color: '#FFFFFF', border: '1px solid #334155' }} />
            <button type="submit" style={{ padding: '12px', background: '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Masuk Panel</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={{ color: '#94A3B8', fontSize: '0.85rem', textDecoration: 'none' }}>← Kembali ke Website Utama</Link>
          </div>
        </div>

        {/* NOTIFIKASI TOAST (DI HALAMAN LOGIN) */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: '30px', right: '30px',
            background: toast.type === 'success' ? '#10B981' : '#EF4444',
            color: '#FFFFFF', padding: '16px 24px', borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px',
            zIndex: 9999, fontWeight: 'bold', fontSize: '0.95rem',
            animation: 'slideUpFade 0.3s ease-out forwards'
          }}>
            <span style={{ fontSize: '1.2rem' }}>{toast.type === 'success' ? '✅' : '⚠️'}</span>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  // TAMPILAN DASHBOARD ADMIN (LEBAR PENUH)
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#F8FAFC', overflow: 'hidden', fontFamily: 'Plus Jakarta Sans, sans-serif', position: 'relative' }}>
      
      {/* CSS Tambahan untuk Animasi Toast */}
      <style>
        {`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* SIDEBAR KIRI PATEN */}
      <aside style={{ width: '260px', background: '#0F172A', color: '#FFFFFF', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '4px 0 10px rgba(0,0,0,0.05)', height: '100vh' }}>
        <div style={{ padding: '25px 20px', borderBottom: '1px solid #1E293B' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#38BDF8' }}>Panel Admin</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.80rem', color: '#94A3B8' }}>Portofolio Pendidik</p>
        </div>

        <nav style={{ flex: 1, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            { id: 'profil', label: '✎ Kelola Profil Biodata' },
            { id: 'matkul', label: '📚 Tambah Mata Kuliah' },
            { id: 'topik', label: '📑 Tambah Topik' },
            { id: 'artefak', label: '📂 Kelola Artefak' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  textAlign: 'left',
                  width: '100%',
                  padding: '12px 20px',
                  background: isActive ? '#3B82F6' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#CBD5E1',
                  border: 'none',
                  borderLeft: isActive ? '4px solid #38BDF8' : '4px solid transparent',
                  cursor: 'pointer',
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontSize: '0.95rem',
                  transition: 'background 0.2s'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#1E293B', color: '#CBD5E1', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', transition: 'background 0.2s' }}>
            🌐 Lihat Website Utama
          </Link>
          <button onClick={() => setIsAuth(false)} style={{ width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', transition: 'background 0.2s' }}>
            🚪 Keluar Sesi
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA DI SEBELAH KANAN */}
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '30px 40px', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', background: '#FFFFFF', borderRadius: '12px', padding: '35px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', minHeight: 'calc(100vh - 60px)', boxSizing: 'border-box' }}>

          {/* 0. Form Ubah Biodata */}
          {activeTab === 'profil' && (
            <div>
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
            </div>
          )}

          {/* 1. Form Mata Kuliah */}
          {activeTab === 'matkul' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#1E293B', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>Tambah Mata Kuliah Baru</h2>
              <form onSubmit={handleAddMK} style={{ marginTop: '20px' }}>
                <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Nama Mata Kuliah</label>
                <input type="text" placeholder="Contoh: Pembelajaran Terpadu" value={mkNama} onChange={e => setMkNama(e.target.value)} required style={inputStyle} />
                
                <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Deskripsi Singkat</label>
                <textarea placeholder="Deskripsi mengenai mata kuliah ini..." value={mkDeskripsi} onChange={e => setMkDeskripsi(e.target.value)} rows={3} required style={inputStyle} />
                
                <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Refleksi Akhir Mata Kuliah</label>
                <textarea placeholder="Refleksi keseluruhan..." value={mkRefleksi} onChange={e => setMkRefleksi(e.target.value)} rows={3} required style={inputStyle} />
                
                <button type="submit" className="btn-primary">Simpan Mata Kuliah</button>
              </form>
            </div>
          )}

          {/* 2. Form Topik */}
          {activeTab === 'topik' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#1E293B', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>Tambah Topik Pembelajaran</h2>
              <form onSubmit={handleAddTopik} style={{ marginTop: '20px' }}>
                <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Pilih Induk Mata Kuliah</label>
                <select value={tMkId} onChange={e => setTMkId(e.target.value)} required style={inputStyle}>
                  <option value="" disabled>-- Pilih Mata Kuliah --</option>
                  {mataKuliahList.map(mk => (
                    <option key={mk.id} value={mk.id}>{mk.nama_mata_kuliah}</option>
                  ))}
                </select>

                <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Nama Topik</label>
                <input type="text" placeholder="Contoh: Topik 1: Konsep Dasar" value={tNama} onChange={e => setTNama(e.target.value)} required style={inputStyle} />
                
                <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Uraian Topik</label>
                <textarea placeholder="Penjelasan uraian topik..." value={tUraian} onChange={e => setTUraian(e.target.value)} rows={3} required style={inputStyle} />
                
                <label style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Refleksi Topik</label>
                <textarea placeholder="Refleksi khusus topik ini..." value={tRefleksi} onChange={e => setTRefleksi(e.target.value)} rows={3} required style={inputStyle} />
                
                <button type="submit" className="btn-primary">Simpan Topik</button>
              </form>
            </div>
          )}

          {/* 3. Kelola Artefak (Tambah, Edit, Hapus, dan Tabel Daftar) */}
          {activeTab === 'artefak' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#1E293B', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px' }}>
                {editingArtefakId !== null ? 'Edit Artefak Pembelajaran' : 'Tambah Artefak Pembelajaran'}
              </h2>

              <form onSubmit={handleSaveArtefak} style={{ marginTop: '20px', background: '#F8FAFC', padding: '25px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}>
                
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>1. Pilih Mata Kuliah</label>
                <select 
                  value={selectedMatkulId} 
                  onChange={e => { setSelectedMatkulId(e.target.value); setATopikId(''); }} 
                  required 
                  style={inputStyle}
                >
                  <option value="" disabled>-- Pilih Mata Kuliah Terlebih Dahulu --</option>
                  {mataKuliahList.map(mk => (
                    <option key={mk.id} value={mk.id}>{mk.nama_mata_kuliah}</option>
                  ))}
                </select>

                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>2. Pilih Topik</label>
                <select 
                  value={aTopikId} 
                  onChange={e => setATopikId(e.target.value)} 
                  required 
                  disabled={!selectedMatkulId} 
                  style={{ ...inputStyle, opacity: !selectedMatkulId ? 0.6 : 1 }}
                >
                  <option value="" disabled>
                    {selectedMatkulId ? '-- Pilih Topik dari Mata Kuliah Ini --' : '-- Pilih Mata Kuliah di Atas Terlebih Dahulu --'}
                  </option>
                  {filteredTopikList.map(t => (
                    <option key={t.id} value={t.id}>{t.nama_topik}</option>
                  ))}
                </select>

                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Judul Artefak</label>
                <input type="text" placeholder="Cth: Modul Ajar Siklus 1" value={aJudul} onChange={e => setAJudul(e.target.value)} required style={inputStyle} />
                
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Jenis Artefak</label>
                <select value={aJenis} onChange={e => { setAJenis(e.target.value); setAFile(null); setALink(''); }} required style={inputStyle}>
                  <option value="Dokumen / PDF">Dokumen / PDF (Upload File)</option>
                  <option value="Dokumentasi / Foto">Dokumentasi / Foto (Upload File)</option>
                  <option value="Dokumentasi / Video">Dokumentasi / Video (URL YouTube)</option>
                </select>

                {aJenis === 'Dokumen / PDF' ? (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Unggah File PDF Baru {editingArtefakId && '(Opsional)'}</label>
                    <input type="file" accept=".pdf" onChange={e => setAFile(e.target.files ? e.target.files[0] : null)} style={{ ...inputStyle, padding: '8px', background: '#FFFFFF' }} />
                  </div>
                ) : aJenis === 'Dokumentasi / Foto' ? (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Unggah File Foto Baru {editingArtefakId && '(Opsional)'}</label>
                    <input type="file" accept="image/*" onChange={e => setAFile(e.target.files ? e.target.files[0] : null)} style={{ ...inputStyle, padding: '8px', background: '#FFFFFF' }} />
                  </div>
                ) : (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Tautan URL (Link Video YouTube)</label>
                    <input type="url" placeholder="https://youtube.com/..." value={aLink} onChange={e => setALink(e.target.value)} required style={inputStyle} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" disabled={isUploading}>
                    {isUploading ? 'Sedang Mengunggah...' : editingArtefakId !== null ? 'Simpan Perubahan' : 'Simpan Artefak'}
                  </button>

                  {editingArtefakId !== null && (
                    <button 
                      type="button" 
                      onClick={() => { setEditingArtefakId(null); setAJudul(''); setALink(''); setAFile(null); setSelectedMatkulId(''); setATopikId(''); }}
                      style={{ padding: '10px 20px', background: '#64748B', color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Daftar Tabel Artefak Tersimpan */}
              <h3 style={{ marginTop: '40px', color: '#1E293B', fontSize: '1.1rem' }}>Daftar Artefak Tersimpan</h3>
              <div style={{ overflowX: 'auto', marginTop: '15px', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#E2E8F0', color: '#1E293B' }}>
                      <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Judul Artefak</th>
                      <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Jenis</th>
                      <th style={{ padding: '10px', border: '1px solid #CBD5E0' }}>Topik Terkait</th>
                      <th style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artefakList.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '15px', textAlign: 'center', color: '#64748B' }}>Belum ada artefak tersimpan.</td>
                      </tr>
                    ) : (
                      artefakList.map((item) => (
                        <tr key={item.id} style={{ background: '#FFFFFF' }}>
                          <td style={{ padding: '10px', border: '1px solid #CBD5E0' }}>{item.judul}</td>
                          <td style={{ padding: '10px', border: '1px solid #CBD5E0' }}>{item.jenis}</td>
                          <td style={{ padding: '10px', border: '1px solid #CBD5E0' }}>{item.topik?.nama_topik || 'Topik Tidak Ditemukan'}</td>
                          <td style={{ padding: '10px', border: '1px solid #CBD5E0', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleEditClick(item)}
                              style={{ padding: '6px 12px', background: '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '0.85rem' }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteArtefak(item.id)}
                              style={{ padding: '6px 12px', background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* --- KOMPONEN TOAST MELAYANG DI KANAN BAWAH --- */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: toast.type === 'success' ? '#10B981' : '#EF4444',
          color: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          fontWeight: 'bold',
          fontSize: '0.95rem',
          animation: 'slideUpFade 0.3s ease-out forwards'
        }}>
          <span style={{ fontSize: '1.2rem' }}>{toast.type === 'success' ? '✅' : '⚠️'}</span>
          {toast.message}
        </div>
      )}

    </div>
  );
}