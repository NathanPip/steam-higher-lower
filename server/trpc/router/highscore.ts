import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const highscoreRouter = router({
  newHighscore: publicProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(input.id);
      console.log(input.name);
      await ctx.prisma.highscore.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
      return "You're in the books";
    }),
});
