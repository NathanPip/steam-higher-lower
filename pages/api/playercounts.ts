import { IncomingHttpHeaders } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

type steamResponse = {
  response: {
    player_count: number;
    result: number;
  };
};

export interface Headers extends IncomingHttpHeaders {
  Authorization: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const headers = req.headers as Headers;
    const auth = headers.Authorization;
    if(auth !== process.env.API_SECRET_KEY) throw new Error("Not Authorized");
    const gameAmt = 15;
    const index = await prisma.index.findUnique({
      where: {
        name: "PlayerCounts",
      },
    });
    if (!index) throw new Error("no data found");
    const games = await prisma.steamGame.findMany({
      where: {
        id: {
          gt: index.index,
          lt: index.index + gameAmt + 1,
        },
      },
    });
    console.log(games);
    if (!games) throw new Error("no games found");
    for (let i = index.index + 1; i <= games.length + index.index; i++) {
      const count = (await (
        await fetch(
          `http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=${
            games[i - index.index - 1].appId
          }`
        )
      ).json()) as steamResponse;
      console.log(count);
      await prisma.steamGame.update({
        where: {
          id: i,
        },
        data: {
          playerCount: count.response.player_count,
        },
      });
    }
    if (games.length < gameAmt) {
      await prisma.index.update({
        where: {
          name: "PlayerCounts",
        },
        data: {
          index: 0,
        },
      });
    } else {
      await prisma.index.update({
        where: {
          name: "PlayerCounts",
        },
        data: {
          index: index.index + gameAmt,
        },
      });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
