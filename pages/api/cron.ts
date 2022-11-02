import { NextApiRequest, NextApiResponse } from "next";
import { scrapeTopGames } from "../../lib/steamUtils";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
      let games = await scrapeTopGames();
      await prisma.topSteamGames.update({
        where: {
          id: 1
        },
        data: {
          games: JSON.stringify(games)
        }
      })
      await prisma.$disconnect()
      res.status(200).json({success: true});
  } catch (err) {
    await prisma.$disconnect()
    console.log(err);
    res.status(500).json(err);
  }
}
