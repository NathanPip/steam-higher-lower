import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try{
    const body = await req.body;
    const data = await (await fetch(`http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=${body}`)).json();
    res.status(200).json({playerCount: data.response.player_count});
    } catch(err) {
      res.status(500).json(err);
    }
  }