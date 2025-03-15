import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { IStorage } from "./storage";

class AWS_S3 implements IStorage {
  private client: S3Client;

  constructor(
    region: string,
    credentials: { accessKeyId: string; secretAccessKey: string }
  ) {
    this.client = new S3Client({
      region,
      credentials,
    });
  }

  async getUrlByKey(
    bucketName: string | undefined,
    key: string | null
  ): Promise<string | null> {
    if (!key) {
      return null;
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: 3600,
    });
  }

  async putByKey(bucketName: string, key: string, file: File): Promise<void> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });
    await this.client.send(command);
  }

  async deleteByKey(bucketName: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await this.client.send(command);
  }

  async getAll(bucketName: string): Promise<{
    bucketName: string;
    numberOfObjects: number;
    objects: StorageObject[];
  }> {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
    });

    const { Name, KeyCount, Contents } = await this.client.send(command);

    const objects = (Contents as StorageObject[]) || [];

    const urls = await Promise.all(
      objects.map((obj) => this.getUrlByKey(bucketName, obj.Key))
    );

    for (let i = 0; i < urls.length; i++) {
      objects[i].Url = String(urls[i]);
    }

    return {
      bucketName: Name || "",
      numberOfObjects: KeyCount || 0,
      objects,
    };
  }
}

export const postFilesStorageS3 = new AWS_S3(process.env.AWS_REGION!, {
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
});
