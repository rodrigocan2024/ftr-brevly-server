import { describe, expect, it } from "vitest";
import { isRight } from "@/infra/shared/either.ts";
import { makeLink } from "@/test/factories/make-link.ts";
import { deleteLink } from "./delete-link.ts";

describe("Delete link", () => {
  it("should be able to delete a link", async () => {
    const link = await makeLink();

    const sut = await deleteLink({ id: link.id });

    expect(isRight(sut)).toBe(true);
  });

  it("should not be able to delete a non existing link", async () => {
    const sut = await deleteLink({ id: "non-existing-id" });

    expect(isRight(sut)).toBe(false);
  });
});
