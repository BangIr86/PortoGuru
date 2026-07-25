export interface Artefak {
  id: number;
  judul: string;
  jenis: string;
  link_url: string;
  topik_id: number;
}

export interface Topik {
  id: number;
  nama_topik: string;
  uraian_topik: string;
  refleksi: string;
  mata_kuliah_id: number;
  artefak: Artefak[]; 
}

export interface MataKuliah {
  id: number;
  nama_mata_kuliah: string;
  deskripsi_singkat: string;
  refleksi: string;
  topik: Topik[]; 
}

// TAMBAHAN BARU: Tipe data Profil
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
}