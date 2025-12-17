import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { incrementLinkAccessCount } from "@/app/functions/increment-link-access-count.ts";
import { unwrapEither } from "@/infra/shared/either.ts";

export const incrementLinkAccessCountRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.patch(
    "/links/:id",
    {
      schema: {
        summary: "Increment link access count",
        tags: ["Links"],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            link: z.object({
              id: z.string(),
              originalUrl: z.string().url(),
              shortUrl: z.string(),
              accessCount: z.number(),
              createdAt: z.date(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const result = await incrementLinkAccessCount({ id });

      if (result.right) {
        const { link } = unwrapEither(result);
        return reply.status(200).send({ link });
      }

      const { message } = unwrapEither(result);
      return reply.status(404).send({ message });
    },
  );
};
