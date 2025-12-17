import { describe, expect, it } from "vitest";
import { isRight, unwrapEither } from "@/infra/shared/either.ts";
import { makeLink } from "@/test/factories/make-link.ts";
import { incrementLinkAccessCount } from "./increment-link-access-count.ts";

describe("Increment link access count", () => {
  it("should be able to increment link access count", async () => {
    const link = await makeLink();

    const sut = await incrementLinkAccessCount({ id: link.id });

    expect(isRight(sut)).toBe(true);

    expect(unwrapEither(sut)).toEqual({
      link: expect.objectContaining({
        accessCount: 1,
      }),
    });
  });
});
