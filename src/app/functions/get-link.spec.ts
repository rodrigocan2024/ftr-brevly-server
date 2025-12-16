import { describe, expect, it } from "vitest";
import { isRight, unwrapEither } from "@/infra/shared/either.ts";
import { makeLink } from "@/test/factories/make-link.ts";
import { getLink } from "./get-link.ts";

describe("Get link", () => {
  it("should be able to get a link", async () => {
    const link = await makeLink();

    const sut = await getLink({ shortUrl: link.shortUrl });

    expect(isRight(sut)).toBe(true);

    expect(unwrapEither(sut)).toEqual({
      link: expect.objectContaining({
        id: link.id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        accessCount: link.accessCount,
        createdAt: link.createdAt,
      }),
    });
  });

  it("should not be able to get a link with an invalid shortUrl", async () => {
    const sut = await getLink({ shortUrl: "non-existing-short-url" });

    expect(isRight(sut)).toBe(false);
  });
});
