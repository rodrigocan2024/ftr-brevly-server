import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db/index.ts";
import { links } from "@/infra/db/schemas/links.ts";
import { type Either, makeLeft, makeRight } from "@/infra/shared/either.ts";
import { LinkNotFoundError } from "./errors/link-not-found-error.ts";

const incrementLinkAccessCountInput = z.object({
  id: z.string(),
});

type IncrementLinkAccessCountInput = z.infer<
  typeof incrementLinkAccessCountInput
>;

type IncrementLinkAccessCountOutput = {
  link: {
    id: string;
    originalUrl: string;
    shortUrl: string;
    accessCount: number;
    createdAt: Date;
  };
};

export async function incrementLinkAccessCount(
  input: IncrementLinkAccessCountInput,
): Promise<Either<Error, IncrementLinkAccessCountOutput>> {
  const { id } = incrementLinkAccessCountInput.parse(input);

  const [link] = await db.select().from(links).where(eq(links.id, id)).limit(1);

  if (!link) {
    return makeLeft(new LinkNotFoundError());
  }

  link.accessCount += 1;

  await db
    .update(links)
    .set({
      accessCount: link.accessCount,
    })
    .where(eq(links.id, id));

  return makeRight({ link });
}
