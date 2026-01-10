import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  res.cookies.set("X-IAK", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    expires: new Date(0), //MEANS 12 HOURS
  });

  return res;
}
