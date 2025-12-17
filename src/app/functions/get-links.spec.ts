import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/infra/db/index.ts";
import { schema } from "@/infra/db/schemas/index.ts";
import { isRight, unwrapEither } from "@/infra/shared/either.ts";
import { makeLink } from "@/test/factories/make-link.ts";
import { getLinks } from "./get-links.ts";

describe("Get links", () => {
  beforeEach(async () => {
    await db.delete(schema.links);
  });

  it("should be able to get the links", async () => {
    const link1 = await makeLink();
    const link2 = await makeLink();
    const link3 = await makeLink();
    const link4 = await makeLink();
    const link5 = await makeLink();

    const sut = await getLinks({ page: 1, pageSize: 5 });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ]);
  });

  it("should be able to get paginated links", async () => {
    await makeLink();
    await makeLink();
    await makeLink();
    await makeLink();
    await makeLink();

    const sut = await getLinks({ page: 1, pageSize: 3 });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toHaveProperty("links");
    expect(unwrapEither(sut)).toHaveProperty("total");
    expect(unwrapEither(sut).links).toHaveLength(3);
    expect(unwrapEither(sut).total).toBe(5);
  });
});
