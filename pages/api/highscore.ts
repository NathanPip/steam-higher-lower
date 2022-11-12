import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

type RequestBody = {
    name: string;
    id: string;
} 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {  
  try {
    let {name, id}: RequestBody = await JSON.parse(req.body);
    if(!name || !id) throw new Error("invalid request");
    await prisma.highscore.update({
        where: {
            id: id
        },
        data: {
            name: name
        }
    })
    console.log("updated")
    res.status(200).json("name updated");
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
}