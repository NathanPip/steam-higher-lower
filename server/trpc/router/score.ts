import type { Highscore } from "@prisma/client";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const scoreRouter = router({

  getScores: publicProcedure.query(async ({ ctx }) => {
    let highestScore: Highscore[] | number =
      await ctx.prisma.highscore.findMany({
        orderBy: {
          score: "desc",
        },
        take: 1,
      });
    highestScore = highestScore[0] ? highestScore[0].score : 0;
    const scoreTotals = await ctx.prisma.scores.findFirst();
    const total = scoreTotals?.scoreTotal;
    const amt = scoreTotals?.scoresAmt;
    const averageScore =
      total && amt ? Math.ceil((total / amt) * 100) / 100 : 0;
    return { averageScore, highestScore };
  }),

  postScores: publicProcedure
    .input(z.object({ id: z.string(), score: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, score } = input;
      await ctx.prisma.scores.upsert({
        where: {
          id: 1,
        },
        update: {
          scoreTotal: {
            increment: score,
          },
          scoresAmt: {
            increment: 1,
          },
        },
        create: {
          scoreTotal: score,
          scoresAmt: 1,
        },
      });

      await ctx.prisma.highscore.updateMany({
        where: {
          score: {
            gt: score,
          },
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });
      await ctx.prisma.highscore.updateMany({
        where: {
          score: {
            lt: score,
          },
        },
        data: {
          beaten: {
            increment: 1,
          },
        },
      });
      await ctx.prisma.highscore.updateMany({
        where: {
          score: {
            equals: score,
          },
        },
        data: {
          matched: {
            increment: 1,
          },
        },
      });
      let highestScore: Highscore[] | number =
        await ctx.prisma.highscore.findMany({
          orderBy: {
            score: "asc",
          },
          take: 1,
        });
      highestScore = highestScore[0] ? highestScore[0].score : 0;
      if (highestScore < score) {
        await ctx.prisma.highscore.create({ data: { score: score, id: id } });
      }
      return "Finshed"
    }),
});
