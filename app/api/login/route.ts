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
            return NextResponse.json({ "error": "Username atau Password salah" }, { status: 422 })
        }

        const user = rows[0]
        const token = jwt.sign({
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET!, { expiresIn: "12h" })

        const accountInfo = jwt.sign({
            username: user.username,
            role: user.role,
        }, process.env.INFO_SECRET!, { expiresIn: "12h" })

        const res = NextResponse.json("success")
        res.cookies.set("X-IAK", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 60 * 12 //MEANS 12 HOURS
        })

        res.cookies.set("UAI", accountInfo, {
            httpOnly: false,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 60 * 12 //MEANS 12 HOURS
        })

        return res
    } catch (error:any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ "error": error.issues[0].message }, { status: 400 })
        }
        return NextResponse.json({ "error": error.message }, { status: 500 })
    }
}