import DB from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows]: any[] = await DB.query(`
            SELECT id, nama, jenis, qty, tahun_pengadaan, kondisi, lokasi,
                status_op, ket, IF(ip = '', '-', ip) AS ip, IF(mac = '', '-', mac) AS mac, created_by, created_at 
            FROM barang
        `)

        const data = rows.map((rows: any, index: number) => ({
            no: index + 1,
            ...rows
        }))

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}