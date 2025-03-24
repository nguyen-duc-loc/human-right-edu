import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import slugify from "slugify";

import handleError from "@/lib/handlers/error";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";
import { postFilesStorageS3 } from "@/lib/store/aws_s3";
import { EditPostSchema } from "@/lib/validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const client = await pool.connect();

  try {
    const userId = (await detectUserIdFromRequest(request)) ?? -1;

    const queryPostsResult = await client.query(
      `SELECT
          posts.slug,
          users.username AS "authorUsername",
          users.avatar AS "authorAvatar",
          posts.title,
          posts.tags,
          posts.links,
          posts.content,
          posts."createdAt",
          COALESCE(lk.liked, FALSE) AS liked,
          COALESCE(l."numLikes", 0) AS "numLikes",
          COALESCE(c."numComments", 0) AS "numComments"
        FROM
          posts
          LEFT JOIN (
            SELECT
              "postId",
              COUNT(*) as "numLikes"
            FROM
              likes
            GROUP BY
              "postId"
          ) l ON posts."postId" = l."postId"
          LEFT JOIN (
            SELECT
              "postId",
              COUNT(*) as "numComments"
            FROM
              comments
            GROUP BY
              "postId"
          ) c ON posts."postId" = c."postId"
          JOIN users ON posts."authorId" = users.id
          LEFT JOIN (
            SELECT
              "postId",
              TRUE AS liked
            FROM
              likes
            WHERE
              "userId" = $1
            GROUP BY
              "postId"
          ) lk ON posts."postId" = lk."postId"
        WHERE
          posts.slug = $2
      `,
      [userId, slug]
    );

    const post: GetPostBySlugResponseData = queryPostsResult.rows[0] || null;

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const client = await pool.connect();

  try {
    const queryPostResult = await client.query(
      `SELECT "postId", "authorId" FROM posts WHERE slug = $1`,
      [slug]
    );
    if (!queryPostResult.rowCount) {
      throw new NotFoundError("Post could not be found");
    }

    const authorId = queryPostResult.rows[0].authorId;
    const userId = await detectUserIdFromRequest(request);
    if (!userId || userId !== Number(authorId)) {
      throw new ForbiddenError();
    }

    const formData = await request.formData();
    const body = {
      title: formData.get("title") || "",
      content: formData.get("content") || "",
      tags: formData.getAll("tags") || [],
      links: formData.getAll("links") || [],
      removedFiles: formData.getAll("removedFiles") || [],
      files: (formData.getAll("files") as File[]) || [],
    };

    const validatedData = EditPostSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const {
      title,
      content,
      tags,
      removedFiles,
      files: uploadedFiles,
      links,
    } = validatedData.data;
    const files: { fileId: string; name: string }[] = uploadedFiles.map(
      (file) => ({
        fileId: nanoid(),
        name: file.name,
      })
    );

    const postId = queryPostResult.rows[0].postId;

    await client.query("BEGIN");

    const queryFilesResult = await client.query(
      `SELECT
          files."fileId"
        FROM
          files
        WHERE
          files."postId" = $1`,
      [postId]
    );
    const foundedFiles: Pick<FileModel, "fileId">[] = queryFilesResult.rows;
    const removedFileIds = Array.from(
      new Set(foundedFiles.map((file) => file.fileId)).intersection(
        new Set(removedFiles)
      )
    );

    const [editPostResult] = await Promise.all([
      client.query(
        `UPDATE 
            posts 
          SET
            slug = $1,
            title = $2,
            content = $3,
            tags = $4,
            links = $5
          WHERE
            posts."postId" = $6
          RETURNING *`,
        [
          slugify(`${title} ${nanoid()}`),
          title,
          content,
          tags.map((tag) => tag.toLowerCase()),
          links,
          postId,
        ]
      ),
      ...files.map(({ fileId, name }) =>
        client.query(
          `INSERT INTO files("fileId", "postId", name) VALUES ($1, $2, $3)`,
          [fileId, postId, name]
        )
      ),
      client.query(`DELETE FROM files WHERE files."fileId" = ANY($1)`, [
        removedFileIds,
      ]),
      ...files.map((file, idx) =>
        postFilesStorageS3.putByKey(
          process.env.AWS_BUCKET!,
          `${process.env.POST_FILES_FOLDER}/${postId}/${file.fileId}`,
          uploadedFiles[idx]
        )
      ),
      ...removedFileIds.map((fileId) =>
        postFilesStorageS3.deleteByKey(
          process.env.AWS_BUCKET!,
          `${process.env.POST_FILES_FOLDER}/${postId}/${fileId}`
        )
      ),
    ]);
    const newPost: EditPostResponseData = editPostResult.rows[0];

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newPost,
          files,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    await client.query("ROLLBACK");

    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const client = await pool.connect();

  try {
    const queryPostResult = await client.query(
      `SELECT "postId", "authorId" FROM posts WHERE slug = $1`,
      [slug]
    );
    if (!queryPostResult.rowCount) {
      throw new NotFoundError("Post could not be found");
    }

    const authorId = queryPostResult.rows[0].authorId;
    const userId = await detectUserIdFromRequest(request);
    if (!userId || userId !== Number(authorId)) {
      throw new ForbiddenError();
    }

    const postId = queryPostResult.rows[0].postId;

    await client.query("BEGIN");

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
    const foundedFiles: Pick<FileModel, "fileId" | "name">[] =
      queryFilesResult.rows;

    await Promise.all([
      client.query(`DELETE FROM posts WHERE posts."postId" = $1`, [postId]),
      ...foundedFiles.map((file) =>
        postFilesStorageS3.deleteByKey(
          process.env.AWS_BUCKET!,
          `${process.env.POST_FILES_FOLDER}/${postId}/${file.fileId}`
        )
      ),
    ]);

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    await client.query("ROLLBACK");

    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
