import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {  
  try {
    let scoreRes: string = await req.body;
    if(scoreRes == undefined) throw new Error("no score was sent");
    let score = parseInt(scoreRes);
    const scoreTotals = await prisma.scores.findFirst();
    let highscores = await prisma.highscore.findMany();
    highscores = highscores.sort((a,z) => a.score - z.score);
    const highestScore = highscores[0].score;
    const isHighest = score > highestScore;
    if(isHighest) {
        await prisma.highscore.create({data: {score: score}})
    }
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
    if(scoreTotals?.scoreTotal == undefined || scoreTotals.scoresAmt === undefined) throw new Error("could not find scores");
    const avg = Math.ceil((scoreTotals.scoreTotal / scoreTotals.scoresAmt)*100)/100;
    let total = scoreTotals.scoreTotal + score;
    let amt = scoreTotals.scoresAmt + 1;
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