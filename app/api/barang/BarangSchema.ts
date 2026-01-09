import {z} from "zod"

export const BarangSchema = z.object({
    nama: z.string().min(1, "nama barang tidak boleh kosong"),
    jenis: z.string().min(1, "jenis barang tidak boleh kosong"),
    qty: z.number().min(0, "jumlah barang tidak < 0"),
    tahun_pengadaan: z.string().min(1, "tahun pengadaan barang tidak boleh kosong"),
    kondisi: z.string().min(1, "kondisi barang tidak boleh kosong"),
    lokasi: z.string().min(1, "lokasi barang tidak boleh kosong"),
    status_op: z.union([z.literal(0), z.literal(1), z.boolean()]).transform(v => (v === true ? 1 : v === false ? 0 : v)),
    ket: z.string(),
    ip: z.string(),
    mac: z.string(),
    created_by: z.string().min(1, "user tidak boleh kosong"),
})

export type BarangReq = z.infer<typeof BarangSchema>