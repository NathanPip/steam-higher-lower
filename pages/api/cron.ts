
import { NextApiRequest, NextApiResponse } from 'next';
import { getTopGames } from '../../lib/steamUtils';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    try {
        let games = await getTopGames();
    } catch (err) {

    }
  }