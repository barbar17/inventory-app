export interface BarangForm {
  nama: string,
  jenis: "Goods" | "IT Device",
  qty: number,
  tahun_pengadaan: string,
  kondisi: "Baru" | "Bagus" | "Kurang Baik" | "Rusak",
  lokasi: string,
  status_op: boolean,
  ket: string,
  ip: string,
  mac: string,
  created_by: string,
}

export interface Barang extends BarangForm {
  id: string,
  created_at: string,
}