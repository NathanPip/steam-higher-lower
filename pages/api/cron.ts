import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { scrapeTopGames } from "../../lib/steamUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
      let index = await prisma.index.findUnique({
        where: {
          name: "Games"
        }
      });
      let games = await scrapeTopGames(index?.index || 1);
      for(let i=index?.lastCount || 0; i < games.length; i++) {
        await prisma.steamGame.upsert({
          where: {
            id: i+1 
          },
          update: {
            title: games[i].title,
            appId: games[i].appId
          },
          create: {
            title: games[i].title,
            appId: games[i].appId
          }
        })
      }
      if(index && index.index < 5){
      await prisma.index.update({
        where: {
          name: "Games"
        }, 
        data: {
          index: {
            increment: 1
          },
          lastCount: games.length-1
        }
      })
    } else {
      await prisma.index.update({
        where: {
          name: "Games"
        }, 
        data: {
          index: 1,
          lastCount: 0
        }
      })
    }
      res.status(200).json({games: games});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
