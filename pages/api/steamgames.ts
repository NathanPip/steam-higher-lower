import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { scrapeTopGames } from "../../lib/steamUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
      const pageCount = 6;
      let index = await prisma.index.findUnique({
        where: {
          name: "Games"
        }
      });
      if(!index || index?.index === null) throw new Error("no data found");
      let games = await scrapeTopGames(index?.index || 1);
      for(let i=index.lastCount; i < games.length+index.lastCount; i++) {
        await prisma.steamGame.upsert({
          where: {
            id: i+1 
          },
          update: {
            title: games[i-index.lastCount].title,
            appId: games[i-index.lastCount].appId
          },
          create: {
            title: games[i-index.lastCount].title,
            appId: games[i-index.lastCount].appId
          }
        })
      }
      if(index && index.index < pageCount){
      await prisma.index.update({
        where: {
          name: "Games"
        }, 
        data: {
          index: {
            increment: 1
          },
          lastCount: games.length-1 + index.lastCount
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
