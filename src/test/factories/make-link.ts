import { faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";
import { db } from "@/infra/db/index.ts";
import { schema } from "@/infra/db/schemas/index.ts";

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>,
) {
  const shortUrl = faker.lorem.slug();

  const result = await db
    .insert(schema.links)
    .values({
      originalUrl: faker.internet.url(),
      shortUrl,
      ...overrides,
    })
    .returning();

  return result[0];
}
