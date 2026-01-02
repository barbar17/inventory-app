import DB from "@/app/lib/db";
import { z } from "zod"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";

const LoginSchema = z.object({
    username: z.string().min(1, "Username tidak boleh kosong"),
    password: z.string().min(1, "Password tidak boleh kosong"),
})

type LoginType = z.infer<typeof LoginSchema>

export async function POST(req: Request) {
    try {
        const request = await req.json();
        const body: LoginType = LoginSchema.parse(request);

        const [rows]: any = await DB.query('SELECT username, role FROM user WHERE username = ? AND password = ?', [body.username, body.password]);
        if (!rows || rows.length === 0) {
            return NextResponse.json({ "error": "Username atau Password salah" }, { status: 401 })
        }

        const user = rows[0]
        const token = jwt.sign({
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET!, { expiresIn: "12h" })

        const res = NextResponse.json({username: user.username, role: user.role})
        res.cookies.set("X-IAK", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 12 //MEANS 12 HOURS
        })

        try {
            const [resLog] = await DB.execute(`INSERT INTO login_history (username) VALUES (?)`, [user.username])  
        } catch (error: any) {
            throw new Error(`Gagal menambahkan kelas, ${error.message}`)
        }

        return res
    } catch (error:any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ "error": error.issues[0].message }, { status: 400 })
        }

        let errMsg = error.message
        if(!errMsg || errMsg === "") {
            errMsg = error.code
        }
        return NextResponse.json({ "error": errMsg }, { status: 500 })
    }
}