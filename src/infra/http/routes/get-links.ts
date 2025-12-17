import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { getLinks } from "@/app/functions/get-links.ts";
import { unwrapEither } from "@/infra/shared/either.ts";

export const getLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/links",
    {
      schema: {
        summary: "Get links",
        tags: ["Links"],
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(["createdAt"]).optional(),
          sortDirection: z.enum(["asc", "desc"]).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
        }),
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                originalUrl: z.url(),
                shortUrl: z.string(),
                accessCount: z.number(),
                createdAt: z.date(),
              }),
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery, sortBy, sortDirection, page, pageSize } =
        request.query;

      const result = await getLinks({
        searchQuery,
        sortBy,
        sortDirection,
        page,
        pageSize,
      });

      const { links, total } = unwrapEither(result);

      return reply.status(200).send({ links, total });
    },
  );
};
