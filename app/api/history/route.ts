import DB from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows]: any[] = await DB.query(`SELECT id, username, created_at FROM login_history`)

    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}