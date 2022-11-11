import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {  
  try {
    const body = await req.body;
    console.log(body);
    const scoreRes = await prisma.scores.findFirst();
    if(scoreRes?.scoreTotal == undefined || scoreRes.scoresAmt === undefined) throw new Error("could not find scores");
    const avg = Math.ceil((scoreRes.scoreTotal / scoreRes.scoresAmt)*100)/100;
    let total = scoreRes.scoreTotal + parseInt(body);
    let amt = scoreRes.scoresAmt + 1;
    await prisma.scores.update({
        where: {
            id: 1
        },
        data: {
            scoreTotal: total,
            scoresAmt: amt 
        }
    });
    console.log(avg);
    res.status(200).json(avg.toString());
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}