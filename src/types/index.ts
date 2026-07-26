// ==========================================
// DEFINISI TIPE DATA (TYPESCRIPT BLUEPRINTS)
// ==========================================

export interface Profil {
  id: number;
  nama_lengkap: string;
  gelar_status: string;
  deskripsi_home: string;
  tempat_tanggal_lahir: string;
  universitas: string;
  program_studi: string;
  email: string;
  filosofi_mengajar: string;
  riwayat_pendidikan: string;
  foto_profil?: string; 
}

export interface MataKuliah {
  id: number;
  nama_mata_kuliah: string;
  deskripsi_singkat: string;
  refleksi: string;
  created_at?: string;
}

export interface Topik {
  id: number;
  nama_topik: string;
  uraian_topik: string;
  refleksi: string;
  mata_kuliah_id: number;
  created_at?: string;
}

export interface Artefak {
  id: number;
  judul: string;
  jenis: string;
  link_url: string;
  topik_id: number;
  created_at?: string;
  
  // Untuk relasi saat menarik data (Join Tabel)
  topik?: Topik; 
}