import DB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserSchema, UserReq } from "../../user/UserSchema";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new Error(`id user boleh kosong`);
  }

  const conn = await DB.getConnection();
  try {
    const payload = await req.json();
    const body: UserReq = UserSchema.parse(payload);

    await conn.beginTransaction();
    try {
      const [res] = await conn.execute(
        `UPDATE user SET username = ?, password = ?, role = ? WHERE id = ?`,
        [body.username, body.password, body.role, id]
      );
    } catch (error) {
      throw new Error(`gagal edit user, ${error}`);
    }

    await conn.commit();
    return NextResponse.json("success");
  } catch (error) {
    await conn.rollback();

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: `${error.issues[0].path}: ${error.issues[0].message}` }, { status: 400 });
    }
    return NextResponse.json({ error: error }, { status: 400 });
  } finally {
    await conn.release();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    throw new Error(`id user tidak boleh kosong`);
  }

  const conn = await DB.getConnection();
  await conn.beginTransaction();
  try {
    const [res] = await conn.execute(`DELETE FROM user WHERE id = ?`, [id]);
    await conn.commit();
    return NextResponse.json("success");
  } catch (error) {
    await conn.rollback();
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    conn.release();
  }
}
