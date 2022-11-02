import type { NextApiRequest, NextApiResponse } from 'next'
import {getTopGames} from '../../lib/steam'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json()
}