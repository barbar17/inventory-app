import DB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import { UserSchema, UserReq } from "../user/UserSchema";

//GET ALL USER
export async function GET() {
    try {
        const [rows] = await DB.query('SELECT id, username, password, role FROM user')

        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500})
    }
}

//POST USER
export async function POST(req: NextRequest) {
    const conn = await DB.getConnection()
    try {
        const payload = await req.json();
        const body: UserReq = UserSchema.parse(payload);

        await conn.beginTransaction();
        try {
            const [res] = await conn.execute(`INSERT INTO user (username, password, role) VALUES (?,?,?)`, [body.username, body.password, body.role]);
        } catch (error) {
            throw new Error(`gagal menambahkan user, ${error}`);
        }

        await conn.commit();
        return NextResponse.json("success");
    } catch (error) {
        await conn.rollback();
        if(error instanceof z.ZodError) {
            return NextResponse.json({"error": error.issues}, { status: 400 })
        }
        return NextResponse.json({"error": error}, { status: 400 })
    } finally {
        conn.release();
    }
}