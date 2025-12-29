export interface Barang {
  id: string,
  nama: string,
  jenis: "Goods" | "IT Device",
  qty: number,
  tahunPengadaan: string,
  kondisi: "Baru" | "Bagus" | "Kurang Baik" | "Rusak",
  lokasi: string,
  statusOperasional: boolean,
  ket: string,
  ip: string,
  mac: string
}