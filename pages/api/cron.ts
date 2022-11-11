import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { scrapeTopGames } from "../../lib/steamUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
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
      res.status(200).json({success: true});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
