import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";
import { isRight, unwrapEither } from "@/infra/shared/either.ts";
import { makeLink } from "@/test/factories/make-link.ts";
import { createLink } from "./create-link.ts";
import { ExistingLinkError } from "./errors/existing-link-error.ts";

describe("Create Link Function", async () => {
  it("should be able to create a link", async () => {
    const originalUrl = faker.internet.url();
    const shortUrl = faker.lorem.slug();

    const sut = await createLink({ originalUrl, shortUrl });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );
  });

  it("should not allow creating a link with an existing shortUrl", async () => {
    const existingLink = await makeLink();

    await expect(() =>
      createLink({
        originalUrl: "https://www.google.com",
        shortUrl: existingLink.shortUrl,
      }),
    ).rejects.toBeInstanceOf(ExistingLinkError);
  });
});
