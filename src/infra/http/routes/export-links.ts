import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { exportLinks } from "@/app/functions/export-links.ts";
import { unwrapEither } from "@/infra/shared/either.ts";

export const exportLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/links/export",
    {
      schema: {
        summary: "Export links",
        tags: ["Links"],
        response: {
          200: z.object({
            reportUrl: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await exportLinks();
      const { reportUrl } = unwrapEither(result);

      return reply.status(200).send({ reportUrl });
    },
  );
};
