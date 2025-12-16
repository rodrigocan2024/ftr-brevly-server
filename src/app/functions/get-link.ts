import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db/index.ts";
import { links } from "@/infra/db/schemas/links.ts";
import { type Either, makeLeft, makeRight } from "@/infra/shared/either.ts";
import { LinkNotFoundError } from "./errors/link-not-found-error.ts";

const getLinkInput = z.object({ shortUrl: z.string() });

type GetLinkInput = z.infer<typeof getLinkInput>;

type GetLinkOutput = {
  link: {
    id: string;
    originalUrl: string;
    shortUrl: string;
    accessCount: number;
    createdAt: Date;
  };
};

export async function getLink(
  input: GetLinkInput,
): Promise<Either<Error, GetLinkOutput>> {
  const { shortUrl } = getLinkInput.parse(input);

  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortUrl, shortUrl))
    .limit(1);

  if (!link) {
    return makeLeft(new LinkNotFoundError());
  }

  return makeRight({ link });
}
