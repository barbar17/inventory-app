import DB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { BarangSchema, BarangReq } from "../barang/BarangSchema";
import { z } from "zod";

export async function GET() {
    try {
        const [rows]: any[] = await DB.query(`
            SELECT id, nama, jenis, qty, tahun_pengadaan, kondisi, lokasi,
                status_op, ket, IF(ip = '', '-', ip) AS ip, IF(mac = '', '-', mac) AS mac, created_by, created_at 
            FROM barang
        `)

        const data = rows.map((rows: any, index: number) => ({
            no: index + 1,
            ...rows,
            tahun_pengadaan: rows.tahun_pengadaan.toISOString().slice(0, 10),
            status_op: rows.status_op === 1 ? true : false,
        }))

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const conn = await DB.getConnection()
    try {
        const payload = await req.json()
        const body: BarangReq = BarangSchema.parse(payload)

        await conn.beginTransaction()

        try {
            const [res] = await conn.execute(`INSERT INTO barang (nama, jenis, qty, tahun_pengadaan, kondisi, lokasi, status_op, ket, ip, mac, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                body.nama,
                body.jenis,
                body.qty,
                body.tahun_pengadaan,
                body.kondisi,
                body.lokasi,
                body.status_op,
                body.ket,
                body.ip,
                body.mac,
                body.created_by,
            ])
        } catch (error) {
            throw new Error(`gagal menambahkan barang, ${error}`);
        }

        await conn.commit()

        return NextResponse.json("success")
    } catch (error) {
        await conn.rollback()

        if (error instanceof z.ZodError) {
            return NextResponse.json({"error": `${error.issues[0].path}: ${error.issues[0].message}`}, { status: 400 })
        }
        return NextResponse.json({"error": error}, { status: 400 })
    } finally {
        await conn.release();
    }
}