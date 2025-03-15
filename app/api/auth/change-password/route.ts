import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import {
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";
import { ChangePassWordSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  const client = await pool.connect();

  try {
    const userId = await detectUserIdFromRequest(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const body = await request.json();

    const validatedData = ChangePassWordSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { password } = validatedData.data;

    const queryUserResult = await client.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );
    if (!queryUserResult.rowCount) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(`UPDATE users SET "hashedPassword" = $1`, [
      hashedPassword,
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
