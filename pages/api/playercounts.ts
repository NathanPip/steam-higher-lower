import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
