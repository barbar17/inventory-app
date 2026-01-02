import DB from "@/app/lib/db";
import { NextResponse } from "next/server";


//GET ALL USER
export async function GET() {
    try {
        const [rows] = await DB.query('SELECT username, password, role FROM user')

        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500})
    }
}