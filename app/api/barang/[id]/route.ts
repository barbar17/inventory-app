import DB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { BarangSchema, BarangReq } from "../../barang/BarangSchema";
import { z } from "zod";

export async function PATCH(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    if (!id) {
      throw new Error(`id barang tidak boleh kosong`);
    }

    const conn = await DB.getConnection()
    try {
        const payload = await req.json()
        const body: BarangReq = BarangSchema.parse(payload)

        await conn.beginTransaction()

        try {
            const [res] = await conn.execute(`UPDATE barang SET nama = ?, jenis = ?, qty = ?, tahun_pengadaan = ?, kondisi = ?, lokasi = ?, status_op = ?, ket = ?, ip = ?, mac = ?, created_by = ? WHERE id = ?`, [
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
                id,
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

export async function DELETE(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    if (!id) {
      throw new Error(`id barang tidak boleh kosong`);
    }

    const conn = await DB.getConnection()
    await conn.beginTransaction();
    try {
      const [res] = await conn.execute(`DELETE FROM barang WHERE id = ?`, [id]);
      await conn.commit();
      return NextResponse.json("success");
    } catch (error) {
      await conn.rollback();
      return NextResponse.json({ "error": error }, { status: 500 });
    } finally {
      conn.release();
    }
}