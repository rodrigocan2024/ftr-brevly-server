import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db/index.ts";
import { links } from "@/infra/db/schemas/links.ts";
import { type Either, makeLeft, makeRight } from "@/infra/shared/either.ts";
import { LinkNotFoundError } from "./errors/link-not-found-error.ts";

const deleteLinkInput = z.object({
  id: z.string(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkInput>;

export async function deleteLink(
  input: DeleteLinkInput,
): Promise<Either<Error, null>> {
  const { id } = deleteLinkInput.parse(input);

  const [link] = await db.select().from(links).where(eq(links.id, id)).limit(1);

  if (!link) {
    return makeLeft(new LinkNotFoundError());
  }

  await db.delete(links).where(eq(links.id, id));

  return makeRight(null);
}
