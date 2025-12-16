import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createLink, createLinkInput } from "@/app/functions/create-link.ts";
import { isLeft, unwrapEither } from "@/infra/shared/either.ts";

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/links",
    {
      schema: {
        summary: "Create a new shortened link",
        tags: ["Links"],
        consumes: ["application/json"],
        body: createLinkInput,
        response: {
          201: z.object({
            id: z.uuid(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body;
      console.log({
        originalUrl,
        shortUrl,
      });
      const result = await createLink({ originalUrl, shortUrl });

      if (isLeft(result)) {
        const error = unwrapEither(result);
        return reply.status(400).send({ message: error.message });
      }

      const { id } = unwrapEither(result);

      return reply.status(201).send({ id });
    },
  );
};
