import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { scrapeTopGames } from "../../utils/steamUtils";
import type { Headers } from "./playercounts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const headers = req.headers as Headers;
    const auth = headers.Authorization;
    if (auth !== process.env.API_SECRET_KEY) throw new Error("Not Authorized");
    
    const pageCount = 6;
    const index = await prisma.index.findUnique({
      where: {
        name: "Games",
      },
    });
    if (!index || index?.index === null) throw new Error("no data found");
    const games = await scrapeTopGames(index?.index || 1);
    for (let i = index.lastCount; i < games.length + index.lastCount; i++) {
      await prisma.steamGame.upsert({
        where: {
          id: i + 1,
        },
        update: {
          title: games[i - index.lastCount]?.title,
          appId: games[i - index.lastCount]?.appId,
        },
        create: {
          title: games[i - index.lastCount]?.title,
          appId: games[i - index.lastCount]?.appId,
        },
      });
    }
    if (index && index.index < pageCount) {
      await prisma.index.update({
        where: {
          name: "Games",
        },
        data: {
          index: {
            increment: 1,
          },
          lastCount: games.length - 1 + index.lastCount,
        },
      });
    } else {
      await prisma.index.update({
        where: {
          name: "Games",
        },
        data: {
          index: 1,
          lastCount: 0,
        },
      });
    }
    res.status(200).json({ games: games });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
