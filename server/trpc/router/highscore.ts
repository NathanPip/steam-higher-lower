import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const highscoreRouter = router({
  newHighscore: publicProcedure
    .input(
      z
        .object({ name: z.string().nullish(), id: z.string().nullish() })
        .nullish()
    )
    .mutation(({ ctx, input }) => {
      if (!input?.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Id does not match",
        });
      ctx.prisma.highscore.update({
        where: {
          id: input?.id,
        },
        data: {
          name: input?.name || "unknown",
        },
      });
      return "You're in the books"
    }),
});
