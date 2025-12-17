import { asc, count, desc, ilike } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db/index.ts";
import { schema } from "@/infra/db/schemas/index.ts";
import { type Either, makeRight } from "@/infra/shared/either.ts";

const getLinksInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
});

type GetLinksInput = z.infer<typeof getLinksInput>;

type GetLinksOutput = {
  links: {
    id: string;
    originalUrl: string;
    shortUrl: string;
    accessCount: number;
    createdAt: Date;
  }[];
  total: number;
};

export async function getLinks(
  input: GetLinksInput,
): Promise<Either<never, GetLinksOutput>> {
  const { searchQuery, sortBy, sortDirection, page, pageSize } =
    getLinksInput.parse(input);

  const [links, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.shortUrl, `%${searchQuery}%`)
          : undefined,
      )
      .orderBy((fields) => {
        if (sortBy && sortDirection === "asc") {
          return asc(fields[sortBy]);
        }

        if (sortBy && sortDirection === "desc") {
          return desc(fields[sortBy]);
        }

        return desc(fields.id);
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    db
      .select({ total: count(schema.links.id) })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.shortUrl, `%${searchQuery}%`)
          : undefined,
      ),
  ]);

  return makeRight({ links, total });
}
