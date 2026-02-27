import * as fs from 'fs';
import { extname } from 'path';
import { isDefined } from 'x-ts-utils';
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import env from '@friends-library/env';

type LocalFilePath = string;
type CloudFilePath = string;
type Acl = `public-read` | `private`;
type UploadOpts = { delete?: boolean; acl?: Acl };

let clientInstance: S3Client | null = null;

function getClient(): S3Client {
  if (!clientInstance) {
    const { CLOUD_STORAGE_ENDPOINT, CLOUD_STORAGE_KEY, CLOUD_STORAGE_SECRET } =
      env.require(`CLOUD_STORAGE_ENDPOINT`, `CLOUD_STORAGE_KEY`, `CLOUD_STORAGE_SECRET`);
    let endpoint = CLOUD_STORAGE_ENDPOINT;
    if (!endpoint.startsWith(`https://`)) {
      endpoint = `https://${endpoint}`;
    }
    clientInstance = new S3Client({
      requestHandler: { requestTimeout: 1200000 },
      endpoint,
      region: `us-east-1`,
      forcePathStyle: false,
      credentials: {
        accessKeyId: CLOUD_STORAGE_KEY,
        secretAccessKey: CLOUD_STORAGE_SECRET,
      },
    });
  }

  return clientInstance;
}

export async function downloadFile(cloudFilePath: CloudFilePath): Promise<Buffer> {
  const { CLOUD_STORAGE_BUCKET } = env.require(`CLOUD_STORAGE_BUCKET`);
  const client = getClient();
  const response = await client.send(
    new GetObjectCommand({
      Bucket: CLOUD_STORAGE_BUCKET,
      Key: cloudFilePath,
    }),
  );
  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as AsyncIterable<Buffer>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function metaData(cloudFilePath: CloudFilePath): Promise<{
  LastModified?: Date;
  ContentLength?: number;
  ETag?: string;
  ContentType?: string;
}> {
  const { CLOUD_STORAGE_BUCKET } = env.require(`CLOUD_STORAGE_BUCKET`);
  const client = getClient();
  const headData = await client.send(
    new HeadObjectCommand({
      Key: cloudFilePath,
      Bucket: CLOUD_STORAGE_BUCKET,
    }),
  );
  return headData;
}

export async function filesize(cloudFilePath: CloudFilePath): Promise<number | null> {
  try {
    const { ContentLength } = await metaData(cloudFilePath);
    return ContentLength || null;
  } catch {
    return null;
  }
}

export async function md5File(cloudFilePath: CloudFilePath): Promise<string | null> {
  try {
    const { ETag } = await metaData(cloudFilePath);
    return ETag ? ETag.replace(/"/g, ``) : null;
  } catch {
    return null;
  }
}

export async function uploadFile(
  localFilePath: LocalFilePath,
  cloudFilePath: CloudFilePath,
  opts: UploadOpts = {},
): Promise<string> {
  const { CLOUD_STORAGE_BUCKET_URL, CLOUD_STORAGE_BUCKET } = env.require(
    `CLOUD_STORAGE_BUCKET_URL`,
    `CLOUD_STORAGE_BUCKET`,
  );
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Key: cloudFilePath,
      Body: fs.createReadStream(localFilePath),
      Bucket: CLOUD_STORAGE_BUCKET,
      ContentType: getContentType(localFilePath),
      ACL: opts.acl ?? `public-read`,
    }),
  );
  if (opts.delete === true) {
    fs.unlinkSync(localFilePath);
  }
  return `${CLOUD_STORAGE_BUCKET_URL}/${cloudFilePath}`;
}

export async function deleteFile(cloudFilePath: CloudFilePath): Promise<boolean> {
  const client = getClient();
  const BUCKET = env.requireVar(`CLOUD_STORAGE_BUCKET`);
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: cloudFilePath }));
  return true;
}

export async function uploadFiles(
  files: Map<LocalFilePath, CloudFilePath>,
  opts: UploadOpts = {},
): Promise<string[]> {
  const { CLOUD_STORAGE_BUCKET_URL } = env.require(`CLOUD_STORAGE_BUCKET_URL`);
  const promises = [...files].map(([localPath, cloudPath]) =>
    uploadFile(localPath, cloudPath, opts),
  );

  return Promise.all(promises).then(() => {
    return [...files.values()].map(
      (cloudPath) => `${CLOUD_STORAGE_BUCKET_URL}/${cloudPath}`,
    );
  });
}

export async function listObjects(prefix: CloudFilePath): Promise<CloudFilePath[]> {
  const client = getClient();
  const listData = await client.send(
    new ListObjectsCommand({
      Bucket: env.requireVar(`CLOUD_STORAGE_BUCKET`),
      Prefix: prefix,
    }),
  );
  return (listData.Contents || []).map(({ Key }) => Key).filter(isDefined);
}

export async function rimraf(path: CloudFilePath): Promise<CloudFilePath[]> {
  const { CLOUD_STORAGE_BUCKET } = env.require(`CLOUD_STORAGE_BUCKET`);
  const client = getClient();
  const listData = await client.send(
    new ListObjectsCommand({
      Bucket: CLOUD_STORAGE_BUCKET,
      Prefix: path,
    }),
  );
  const keys = (listData.Contents || []).map(({ Key }) => Key).filter(isDefined);
  if (keys.length === 0) {
    return [];
  }
  const deleteData = await client.send(
    new DeleteObjectsCommand({
      Bucket: CLOUD_STORAGE_BUCKET,
      Delete: {
        Objects: keys.map((Key) => ({ Key })),
      },
    }),
  );
  return (deleteData.Deleted || []).map(({ Key }) => Key).filter(isDefined);
}

function getContentType(path: LocalFilePath): string {
  switch (extname(path)) {
    case `.mp3`:
      return `audio/mpeg`;
    case `.m4b`:
      return `audio/mp4`;
    case `.wav`:
      return `audio/wav`;
    case `.png`:
      return `image/png`;
    case `.pdf`:
      return `application/pdf`;
    case `.epub`:
      return `application/epub+zip`;
    case `.mobi`:
      return `application/x-mobipocket-ebook`;
    case `.zip`:
      return `application/zip`;
    case `.txt`:
      return `text/plain`;
    case `.html`:
      return `text/html`;
    case `.json`:
      return `application/json`;
    case `.css`:
      return `text/css`;
    default:
      throw new Error(`Unexpected file extension: ${path}`);
  }
}
