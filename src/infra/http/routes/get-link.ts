import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { getLink } from "@/app/functions/get-link.ts";
import { isRight, unwrapEither } from "@/infra/shared/either.ts";

export const getLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/links/:shortUrl",
    {
      schema: {
        summary: "Get link by short URL",
        tags: ["Links"],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            originalUrl: z.string(),
            shortUrl: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const shortUrl = request.params.shortUrl;

      const result = await getLink({ shortUrl });

      if (isRight(result)) {
        const { link } = unwrapEither(result);
        return reply.status(200).send(link);
      }

      return reply.status(404).send({ message: "Link not found" });
    },
  );
};
