import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import pool from "@/lib/postgresql";
import { postFilesStorageS3 } from "@/lib/store/aws_s3";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const client = await pool.connect();

  try {
    const queryPostResult = await client.query(
      `SELECT "postId" FROM posts WHERE slug = $1`,
      [slug]
    );
    if (!queryPostResult.rowCount) {
      throw new NotFoundError("Post could not be found");
    }

    const postId = queryPostResult.rows[0].postId;

    const queryFilesResult = await client.query(
      `SELECT
          files."fileId",
          files.name
        FROM
          files
        WHERE
          files."postId" = $1`,
      [postId]
    );
    const foundedFiles: Omit<FileModel, "postId">[] = queryFilesResult.rows;
    const fileUrls = await Promise.all(
      foundedFiles.map((file) =>
        postFilesStorageS3.getUrlByKey(
          process.env.AWS_BUCKET!,
          `${process.env.POST_FILES_FOLDER}/${postId}/${file.fileId}`
        )
      )
    );
    const files: GetFilesInPostResponseData = foundedFiles.map((file, idx) => ({
      name: file.name,
      url: fileUrls[idx],
    }));

    return NextResponse.json(
      {
        success: true,
        data: files,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
