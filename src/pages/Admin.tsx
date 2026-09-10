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

  const [slideshowFiles, setSlideshowFiles] = useState<any[]>([]);
  const [isUploadingSlideshow, setIsUploadingSlideshow] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  // --- STATE MATA KULIAH ---
  const [editingMkId, setEditingMkId] = useState<number | null>(null);
  const [mkNama, setMkNama] = useState('');
  const [mkDeskripsi, setMkDeskripsi] = useState('');
  const [mkUrutan, setMkUrutan] = useState<number>(0);
  const [mkConn, setMkConn] = useState('');
  const [mkChal, setMkChal] = useState('');
  const [mkConc, setMkConc] = useState('');
  const [mkChan, setMkChan] = useState('');

  // --- STATE TOPIK ---
  const [editingTopikId, setEditingTopikId] = useState<number | null>(null);
  const [tNama, setTNama] = useState('');
  const [tUraian, setTUraian] = useState('');
  const [tRefleksi, setTRefleksi] = useState('');

  // --- STATE ARTEFAK ---
  const [editingArtefakId, setEditingArtefakId] = useState<number | null>(null);
  const [aTopikId, setATopikId] = useState('');
  const [aJudul, setAJudul] = useState('');
  const [aJenis, setAJenis] = useState('Dokumen / PDF');
  const [aLink, setALink] = useState('');
  const [aFile, setAFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026') { setIsAuth(true); showToast('Berhasil masuk panel!', 'success'); } 
    else { showToast('Kata sandi salah!', 'error'); }
  };

  const fetchData = async () => {
    const { data: pData } = await supabase.from('profil').select('*').eq('id', 1).single();
    if (pData) setProfil(pData as Profil);

    const { data: files } = await supabase.storage.from('portfolio-files').list('slideshow_profil');
    if (files) setSlideshowFiles(files.filter(f => f.name !== '.emptyFolderPlaceholder'));

    const { data: mkData } = await supabase.from('mata_kuliah').select('*').order('urutan', { ascending: true });
    if (mkData) setMataKuliahList(mkData);
    
    const { data: tData } = await supabase.from('topik').select('*').order('id', { ascending: true });
    if (tData) setTopikList(tData);

    const { data: aData } = await supabase.from('artefak').select('*, topik(id, nama_topik, mata_kuliah_id)');
    if (aData) setArtefakList(aData);
  };

  useEffect(() => { if (isAuth) fetchData(); }, [isAuth]);

  // --- FUNGSI MATA KULIAH ---
  const resetMatkulForm = () => { setEditingMkId(null); setMkNama(''); setMkDeskripsi(''); setMkUrutan(0); setMkConn(''); setMkChal(''); setMkConc(''); setMkChan(''); };
  const handleSaveMK = async (e: React.FormEvent) => {
    e.preventDefault();
    const mkRefleksi4C = JSON.stringify({ connection: mkConn, challenge: mkChal, concept: mkConc, change: mkChan });
    const dataMK = { nama_mata_kuliah: mkNama, deskripsi_singkat: mkDeskripsi, urutan: mkUrutan, refleksi: mkRefleksi4C };
    
    if (editingMkId) {
      const { error } = await supabase.from('mata_kuliah').update(dataMK).eq('id', editingMkId);
      if (error) showToast('Gagal memperbarui: ' + error.message, 'error'); else { showToast('Mata Kuliah diperbarui!', 'success'); fetchData(); resetMatkulForm(); }
    } else {
      const { error } = await supabase.from('mata_kuliah').insert([dataMK]);
      if (error) showToast('Gagal menambah: ' + error.message, 'error'); else { showToast('Mata Kuliah ditambahkan!', 'success'); fetchData(); resetMatkulForm(); }
    }
  };

  const handleDeleteMK = async (id: number) => {
    if (window.confirm('Hapus Mata Kuliah ini? Semua topik & artefak akan terhapus!')) {
      const { error } = await supabase.from('mata_kuliah').delete().eq('id', id);
      if (error) showToast('Gagal menghapus: ' + error.message, 'error'); else { showToast('Mata Kuliah dihapus!', 'success'); fetchData(); }
    }
  };

  // ... (Sisa fungsi form seperti sebelumnya tidak berubah, langsung ke tampilan layout) ...

  const activeMatkulData = mataKuliahList.find(mk => mk.id === managingMatkulId);
  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid var(--card-border)', fontFamily: 'inherit', background: 'var(--bg-color)', color: 'var(--text-main)', boxSizing: 'border-box' as const };

  if (!isAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)' }}>
        <div style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid var(--card-border)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login Admin</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <input type="password" placeholder="Passcode (2026)" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={inputStyle} />
            <button type="submit" style={{ padding: '12px', background: 'var(--accent-color)', color: '#FFF', borderRadius: '6px' }}>Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-color)' }}>
      <aside style={{ width: '260px', background: 'var(--card-bg)', borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)' }}><h2 style={{ margin: 0, color: 'var(--accent-color)' }}>Admin Panel</h2></div>
        <nav style={{ padding: '10px 0', flex: 1 }}>
          <button onClick={() => { setActiveTab('profil'); setManagingMatkulId(null); }} style={{ width: '100%', padding: '15px 20px', textAlign: 'left', background: activeTab === 'profil' ? 'var(--bg-color)' : 'transparent', border: 'none', cursor: 'pointer' }}>Profil</button>
          <button onClick={() => { setActiveTab('manajemen'); setManagingMatkulId(null); }} style={{ width: '100%', padding: '15px 20px', textAlign: 'left', background: activeTab === 'manajemen' ? 'var(--bg-color)' : 'transparent', border: 'none', cursor: 'pointer' }}>Mata Kuliah</button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {activeTab === 'manajemen' && !managingMatkulId && (
          <div style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <h2>Daftar Mata Kuliah</h2>
            <form onSubmit={handleSaveMK} style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
              <label style={{fontWeight: 'bold'}}>Urutan Tampil (Angka)</label>
              <input type="number" value={mkUrutan} onChange={e => setMkUrutan(parseInt(e.target.value) || 0)} required style={inputStyle} />
              
              <label style={{fontWeight: 'bold'}}>Nama Mata Kuliah</label>
              <input type="text" value={mkNama} onChange={e => setMkNama(e.target.value)} required style={inputStyle} />
              
              <label style={{fontWeight: 'bold'}}>Deskripsi Singkat</label>
              <textarea value={mkDeskripsi} onChange={e => setMkDeskripsi(e.target.value)} rows={2} required style={inputStyle} />
              
              <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent-color)', color: '#fff', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Simpan Mata Kuliah</button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'var(--bg-color)' }}><th style={{ padding: '10px', textAlign: 'left' }}>Urutan</th><th style={{ padding: '10px', textAlign: 'left' }}>Nama Matkul</th><th style={{ padding: '10px' }}>Aksi</th></tr></thead>
              <tbody>
                {mataKuliahList.map(mk => (
                  <tr key={mk.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '10px' }}>{mk.urutan}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{mk.nama_mata_kuliah}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button onClick={() => setManagingMatkulId(mk.id)} style={{ padding: '5px 10px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Kelola Isi</button>
                      <button onClick={() => { setEditingMkId(mk.id); setMkNama(mk.nama_mata_kuliah); setMkDeskripsi(mk.deskripsi_singkat); setMkUrutan(mk.urutan); }} style={{ padding: '5px 10px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
                      <button onClick={() => handleDeleteMK(mk.id)} style={{ padding: '5px 10px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      
      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#333', color: '#fff', padding: '15px', borderRadius: '8px' }}>{toast.message}</div>}
    </div>
  );
}