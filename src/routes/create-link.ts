import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/links",
    {
      schema: {
        summary: "Create a link",
        body: z.object({
          originalUrl: z.url(),
          shortUrl: z.url(),
        }),
        response: {
          201: z
            .object({
              linkId: z.uuid(),
            })
            .describe("Link created"),
          400: z.object({ message: z.string() }).describe("Bad request"),
        },
      },
    },
    async (request, reply) => {
      return reply.status(201).send({ linkId: "test" });
    },
  );
};
