import { NextRequest, NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import pool from "@/lib/postgresql";

export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const query = searchParams.get("query") || "";
    const offset = limit * (page - 1);

    const totalTags: number = Number(
      (
        await client.query(
          `SELECT
              count(distinct tag)
            FROM
              posts,
              unnest(tags) AS tag
            WHERE tag ILIKE $1
          `,
          [`%${query}%`]
        )
      ).rows[0].count
    );

    const queryTagsResult = await client.query(
      `SELECT
          name,
          COUNT(*) AS count
        FROM
          posts,
          unnest(tags) AS name
        WHERE name ILIKE $1
        GROUP BY
          name
        ORDER BY
          count DESC
        LIMIT $2
        OFFSET $3
      `,
      [`%${query}%`, limit, offset]
    );

    const tags = queryTagsResult.rows;

    return NextResponse.json(
      {
        success: true,
        data: {
          total: totalTags,
          tags,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
