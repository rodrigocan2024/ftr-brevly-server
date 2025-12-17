import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { stringify } from "csv-stringify";
import { db, pg } from "@/infra/db/index.ts";
import { schema } from "@/infra/db/schemas/index.ts";
import { type Either, makeRight } from "@/infra/shared/either.ts";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage.ts";

export async function exportLinks(): Promise<
  Either<never, { reportUrl: string }>
> {
  const { sql, params } = db
    .select({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      shortUrl: schema.links.shortUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .toSQL();

  const cursor = pg.unsafe(sql, params as string[]).cursor(2);

  const csv = stringify({
    delimiter: ",",
    header: true,
    columns: [
      { key: "originalUrl", header: "Original URL" },
      { key: "shortUrl", header: "Short URL" },
      { key: "accessCount", header: "Access count" },
      { key: "createdAt", header: "Created at" },
    ],
  });

  const uploadToStorageStream = new PassThrough();

  const convertToCSVPipeline = await pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], _encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }
        callback();
      },
    }),
    csv,
    uploadToStorageStream,
  );

  const uploadToStorage = uploadFileToStorage({
    contentType: "text/csv",
    folder: "links",
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream,
  });

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

  return makeRight({ reportUrl: url });
}
