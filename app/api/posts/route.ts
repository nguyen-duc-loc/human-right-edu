import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

import handleError from "@/lib/handlers/error";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";
import { postFilesStorageS3 } from "@/lib/store/aws_s3";
import { CreatePostSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const userId = await detectUserIdFromRequest(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const formData = await request.formData();
    const body = {
      title: formData.get("title") || "",
      content: formData.get("content") || "",
      tags: formData.getAll("tags") || [],
      links: formData.getAll("links") || [],
      files: (formData.getAll("files") as File[]) || [],
    };

    const validatedData = CreatePostSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const {
      title,
      content,
      tags,
      files: uploadedFiles,
      links,
    } = validatedData.data;
    const files: { fileId: string; name: string }[] = uploadedFiles.map(
      (file) => ({
        fileId: nanoid(),
        name: file.name,
      })
    );

    await client.query("BEGIN");

    const insertPostResult = await client.query(
      `INSERT INTO posts(slug, "authorId", title, content, tags, links) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        slugify(`${title} ${nanoid()}`),
        userId,
        title,
        content,
        tags.map((tag) => tag.toLowerCase()),
        links,
      ]
    );
    const newPost: CreatePostResponseData = insertPostResult.rows[0];

    await Promise.all([
      ...files.map(({ fileId, name }) =>
        client.query(
          `INSERT INTO files("fileId", "postId", name) VALUES ($1, $2, $3)`,
          [fileId, newPost.postId, name]
        )
      ),
      ...files.map((file, idx) =>
        postFilesStorageS3.putByKey(
          process.env.AWS_BUCKET!,
          `${process.env.POST_FILES_FOLDER}/${newPost.postId}/${file.fileId}`,
          uploadedFiles[idx]
        )
      ),
    ]);

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newPost,
          files,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    await client.query("ROLLBACK");

    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}

export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const userId = (await detectUserIdFromRequest(request)) ?? -1;
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const query = searchParams.get("query") || "";
    const tag = searchParams.get("tag");
    const offset = limit * (page - 1);

    const totalPosts: number = Number(
      tag && tag.length > 0
        ? (
            await client.query(
              `SELECT COUNT(*) AS count FROM posts WHERE posts.title ILIKE $1 AND posts.tags @> ARRAY[$2]::VARCHAR[]`,
              [`%${query}%`, tag]
            )
          ).rows[0].count
        : (
            await client.query(
              `SELECT COUNT(*) AS count FROM posts WHERE posts.title ILIKE $1`,
              [`%${query}%`]
            )
          ).rows[0].count
    );
    const nextPage = limit * page < totalPosts ? page + 1 : undefined;

    const queryPostsResult =
      tag && tag.length > 0
        ? await client.query(
            `SELECT
          posts.slug,
          users.username AS "authorUsername",
          users.avatar AS "authorAvatar",
          posts.title,
          posts.tags,
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
        WHERE posts.title ILIKE $2 AND posts.tags @> ARRAY[$3]::VARCHAR[]  
        ORDER BY
          posts."createdAt" DESC
        LIMIT $4
        OFFSET $5
      `,
            [userId, `%${query}%`, tag, limit, offset]
          )
        : await client.query(
            `SELECT
          posts.slug,
          users.username AS "authorUsername",
          users.avatar AS "authorAvatar",
          posts.title,
          posts.tags,
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
        WHERE posts.title ILIKE $2
        ORDER BY
          posts."createdAt" DESC
        LIMIT $3
        OFFSET $4
      `,
            [userId, `%${query}%`, limit, offset]
          );

    const allPosts = queryPostsResult.rows;

    return NextResponse.json(
      {
        success: true,
        data: { posts: allPosts, nextPage },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
