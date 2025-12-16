import { z } from "zod";
import { db } from "@/infra/db/index.ts";
import { links } from "@/infra/db/schemas/links.ts";
import { type Either, makeRight } from "@/infra/shared/either.ts";
import { ExistingLinkError } from "./errors/existing-link-error.ts";

export const createLinkInput = z.object({
  originalUrl: z.url(),
  shortUrl: z.string().regex(/^[a-z0-9-_]+$/, {
    message:
      "Deve conter apenas letras minúsculas, números, hífens e underline.",
  }),
});

type CreateLinkInput = z.infer<typeof createLinkInput>;

type CreateLinkOutput = {
  id: string;
};

export async function createLink(
  input: CreateLinkInput,
): Promise<Either<Error, CreateLinkOutput>> {
  const { originalUrl, shortUrl } = createLinkInput.parse(input);

  const existingLink = await db.query.links.findFirst({
    where: (links, { eq }) => eq(links.shortUrl, shortUrl),
  });

  if (existingLink) {
    throw new ExistingLinkError();
  }

  const link = await db
    .insert(links)
    .values({
      originalUrl,
      shortUrl,
    })
    .returning();

  return makeRight({
    id: link[0].id,
  });
}
