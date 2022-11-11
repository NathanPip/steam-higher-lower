import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {  
  try {
    let score = await req.body;
    if(score == undefined) throw new Error("no score was sent");
    score = parseInt(score);
    const scoreRes = await prisma.scores.findFirst();
    let highscores = await prisma.highscore.findMany();
    highscores = highscores.sort((a,z) => a.score - z.score);
    const highestScore = highscores[0];
    const isHighest = score > highestScore;
    await prisma.highscore.updateMany({
        where: {
            score : {
                gt: score
            }
        },
        data : {
            attempts: {
                increment: 1
            }
        }
    })
    await prisma.highscore.updateMany({
        where: {
            score : {
                lt: score
            }
        },
        data : {
            beaten: {
                increment: 1
            }
        }
    })
    await prisma.highscore.updateMany({
        where: {
            score : {
                equals: score
            }
        },
        data : {
            matched: {
                increment: 1
            }
        }
    })
    if(scoreRes?.scoreTotal == undefined || scoreRes.scoresAmt === undefined) throw new Error("could not find scores");
    const avg = Math.ceil((scoreRes.scoreTotal / scoreRes.scoresAmt)*100)/100;
    let total = scoreRes.scoreTotal + score;
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
    res.status(200).json({averageScore: avg.toString(), highestScore, isHighest});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}