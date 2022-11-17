import { Highscore } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

type scoreRes = {
  score: number;
  isHighest: boolean;
  id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    
    let highscores = await prisma.highscore.findMany();
    let highestScore: number;
    if (highscores.length) {
      highscores = highscores.sort((a, z) => a.score - z.score);
      highestScore = highscores[highscores.length - 1].score;
    } else {
      highestScore = 0;
    }

    if (req.method === "GET") {
      const scoreTotals = await prisma.scores.findFirst();
      if (
        scoreTotals?.scoreTotal == undefined ||
        scoreTotals.scoresAmt === undefined
      )
        throw new Error("could not find scores");
      const avg =
        Math.ceil((scoreTotals.scoreTotal / scoreTotals.scoresAmt) * 100) / 100;
      res.status(200).json({ averageScore: avg.toString(), highestScore });
      return;
    }

    let scoreRes = (await JSON.parse(req.body)) as scoreRes;
    if (scoreRes == undefined) throw new Error("no score was sent");
    const { score, id } = scoreRes;

    await prisma.scores.upsert({
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

    await prisma.highscore.updateMany({
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
    await prisma.highscore.updateMany({
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
    await prisma.highscore.updateMany({
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

    if (highestScore < score) {
      await prisma.highscore.create({ data: { score: score, id: id } });
    }

    res.status(200).json({ isHighest: highestScore < score });
    return;
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
    return;
  }
}
