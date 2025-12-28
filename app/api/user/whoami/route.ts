import DB from "@/app/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies()
    const token  =  cookieStore.get("X-IAK")?.value

    if(!token) {
        return NextResponse.json({"error": "Unauthorized"}, {status: 401})
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {username: string, role: string}

        const [rows]: any = await DB.query("SELECT EXISTS(SELECT 1 FROM user WHERE username = ? AND role = ?)", [payload.username, payload.role])
        if (!rows) {
            return NextResponse.json({ "error": "Unauthorized" }, { status: 401 })
        }

        const isUserExists: boolean = rows[0]
        if(!isUserExists) {
            return NextResponse.json({ "error": "Unauthorized" }, { status: 401 })
        }

        return Response.json(payload)
    } catch (error) {
        return NextResponse.json({"error": "Invalid token"}, { status: 401 });
    }
}