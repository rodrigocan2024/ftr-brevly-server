import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { deleteLink } from "@/app/functions/delete-link.ts";
import { isRight } from "@/infra/shared/either.ts";

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/links/:id",
    {
      schema: {
        summary: "Delete a link",
        tags: ["Links"],
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const id = request.params.id;

      const result = await deleteLink({ id });

      if (isRight(result)) {
        reply.status(204).send(null);
      }

      return reply.status(404).send({ message: "Link not found" });
    },
  );
};
