import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const highscoreRouter = router({
  newHighscore: publicProcedure
    .input(
      z
        .object({ name: z.string().nullish(), id: z.string() })
    )
    .mutation(({ ctx, input }) => {
      ctx.prisma.highscore.update({
        where: {
          id: input.id,
        },
        data: {
          name: input?.name || "unknown",
        },
      });
      return "You're in the books"
    }),
});
