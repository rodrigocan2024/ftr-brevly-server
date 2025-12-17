import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { isRight, unwrapEither } from "@/infra/shared/either.ts";
import * as upload from "@/infra/storage/upload-file-to-storage.ts";
import { makeLink } from "@/test/factories/make-link.ts";
import { exportLinks } from "./export-links.ts";

describe("Export links", () => {
  it("should be able to export links", async () => {
    const uploadStub = vi
      .spyOn(upload, "uploadFileToStorage")
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: "http://example.com/file.csv",
        };
      });

    const link1 = await makeLink();
    const link2 = await makeLink();
    const link3 = await makeLink();

    const sut = await exportLinks();

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];

      generatedCSVStream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      generatedCSVStream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });

      generatedCSVStream.on("error", (err) => {
        reject(err);
      });
    });

    const csvAsArray = csvAsString
      .trim()
      .split("\n")
      .map((row) => row.split(","));

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).reportUrl).toBe("http://example.com/file.csv");
  });
});
